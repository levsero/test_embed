import { wait } from '@testing-library/react'
import * as zChat from 'chat-web-sdk'
import _ from 'lodash'
import slider from 'react-slick'
import configureMockStore from 'redux-mock-store'
import thunk from 'redux-thunk'
import { DEFER_CHAT_SETUP } from 'src/embeds/chat/actions/action-types'
import * as setupChatActions from 'src/embeds/chat/actions/setup-chat'
import { getModifiedState } from 'src/fixtures/selectors-test-state'
import firehoseListener from 'src/redux/modules/chat/helpers/firehoseListener'
import zopimApi from 'src/service/api/zopimApi'
import { settings } from 'src/service/settings'
import { win } from 'src/util/globals'
import { setUpChat } from '../setUpChat'

jest.mock('react-slick')
jest.mock('chat-web-sdk')
jest.mock('src/service/api/zopimApi')
jest.mock('src/redux/modules/chat/helpers/firehoseListener')

zChat.getFirehose.mockImplementation(() => ({ on: jest.fn() }))
zChat.setOnFirstReady.mockImplementation((readyObj) => {
  _.forEach(readyObj, (val) => val())
})

const dispatchAction = (customState = {}, chatReadyCallback) => {
  const mockStore = configureMockStore([thunk])
  const store = mockStore(getModifiedState(customState))

  store.dispatch(setUpChat(true, chatReadyCallback))

  return store
}

describe('setupChat', () => {
  describe('when it is not being deferred', () => {
    it('calls handleChatSDKInitialized', async () => {
      dispatchAction()

      await wait(() => {
        expect(zopimApi.handleChatSDKInitialized).toHaveBeenCalled()
      })
    })

    it('calls chatReadyCallback if provided', async () => {
      const chatReadyCallback = jest.fn()
      dispatchAction({}, chatReadyCallback)

      await wait(() => {
        expect(chatReadyCallback).toHaveBeenCalled()
      })
    })

    it('dispatches the handleChatVendorLoaded action creator with zChat and slider vendor', async () => {
      const store = dispatchAction()

      await wait(() => {
        expect(store.getActions()[1]).toEqual({
          type: 'widget/chat/CHAT_VENDOR_LOADED',
          payload: {
            zChat,
            slider,
          },
        })
      })
    })

    it('calls zChat init with the correct params', async () => {
      dispatchAction()

      await wait(() => {
        expect(zChat.init).toHaveBeenCalledWith({
          account_key: '123abc',
          activity_window: win,
          popout: false,
          suppress_console_error: true,
        })
      })
    })

    it("calls zChat init with overrides when they're set within the embeddable config", async () => {
      const stagingState = {
        base: {
          embeddableConfig: {
            embeds: {
              chat: {
                props: {
                  overrideProxy: 'staging.example.com',
                  overrideAuthServerHost: 'staging.auth.example.com',
                },
              },
            },
          },
        },
      }

      dispatchAction(stagingState)

      await wait(() => {
        expect(zChat.init).toHaveBeenCalledWith({
          account_key: '123abc',
          activity_window: win,
          override_proxy: 'staging.example.com',
          override_auth_server_host: 'staging.auth.example.com',
          popout: false,
          suppress_console_error: true,
        })
      })
    })

    it('calls zChat setOnFirstReady with the correct params', async () => {
      dispatchAction()

      await wait(() => {
        expect(zChat.setOnFirstReady).toHaveBeenCalledWith({
          fetchHistory: expect.any(Function),
          ready: expect.any(Function),
        })
      })
    })

    describe('brands', () => {
      describe('when a brand exists', () => {
        it('calls zChat addTags with the current brand if it exists', async () => {
          dispatchAction()

          await wait(() => {
            expect(zChat.addTags).toHaveBeenCalledWith(['ACME'])
          })
        })
      })

      describe('when a brand does not exist', () => {
        it('does not call zChat addTags', async () => {
          dispatchAction({
            base: {
              embeddableConfig: {
                brandCount: 1,
                brand: undefined,
              },
            },
          })

          await wait(() => {
            expect(zChat.addTags).not.toHaveBeenCalled()
          })
        })
      })
    })

    it('calls zopimApi handleZopimQueue with the window', async () => {
      dispatchAction()

      await wait(() => {
        expect(zopimApi.handleZopimQueue).toHaveBeenCalledWith(win)
      })
    })

    it('calls zChat getFirehose', async () => {
      const mockListener = jest.fn()
      const on = jest.fn()

      zChat.getFirehose.mockClear().mockImplementation(() => ({ on }))

      firehoseListener.mockReturnValue(mockListener)

      dispatchAction()

      await wait(() => {
        expect(on).toHaveBeenCalledWith('data', mockListener)
      })
    })

    describe('adding brand tag', () => {
      describe('with no jwtFn in settings', () => {
        it('calls zopimApi handleZopimQueue with the window', async () => {
          dispatchAction({
            base: {
              embeddableConfig: {
                brandCount: 2,
                brand: 'brand 1',
              },
            },
          })

          await wait(() => {
            expect(zChat.addTags).toHaveBeenCalledWith(['brand 1'])
          })
        })
      })

      describe('with a jwtFn in settings', () => {
        beforeEach(() => {
          settings.getChatAuthSettings = () => ({ jwtFn: noop })
        })

        it('calls zopimApi handleZopimQueue with the window', async () => {
          dispatchAction({
            base: {
              embeddableConfig: {
                brandCount: 2,
                brand: 'brand 1',
              },
            },
          })

          await wait(() => {
            expect(zChat.addTags).not.toHaveBeenCalled()
          })
        })
      })
    })
  })

  describe('when it is being deferred', () => {
    it('begins polling the deferred chat endpoint', () => {
      jest.spyOn(setupChatActions, 'deferChatSetup').mockReturnValue({ type: DEFER_CHAT_SETUP })
      const mockStore = configureMockStore([thunk])
      const store = mockStore(
        getModifiedState({
          settings: {
            chat: {
              connectOnDemand: true,
            },
          },
        })
      )

      store.dispatch(setUpChat(true))

      expect(setupChatActions.deferChatSetup).toHaveBeenCalled()
      expect(zopimApi.handleZopimQueue).not.toHaveBeenCalled()
    })

    it('does not defer if overriden', () => {
      jest.spyOn(setupChatActions, 'deferChatSetup').mockReturnValue({ type: DEFER_CHAT_SETUP })
      const mockStore = configureMockStore([thunk])
      const store = mockStore(
        getModifiedState({
          settings: {
            chat: {
              connectOnDemand: true,
            },
          },
        })
      )

      store.dispatch(setUpChat(false))

      expect(setupChatActions.deferChatSetup).not.toHaveBeenCalled()
      expect(zopimApi.handleZopimQueue).toHaveBeenCalled()
    })
  })
})
