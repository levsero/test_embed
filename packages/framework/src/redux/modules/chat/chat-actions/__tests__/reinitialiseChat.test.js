import * as zChat from 'chat-web-sdk'
import { CONNECTION_STATUSES } from 'src/constants/chat'
import * as baseSelectors from 'src/redux/modules/base/base-selectors'
import * as actionTypes from 'src/redux/modules/chat/chat-action-types'
import * as actions from 'src/redux/modules/chat/chat-actions/actions'
import * as chatSelectors from 'src/embeds/chat/selectors/selectors'
import * as callbacks from 'src/service/api/zopimApi/callbacks'
import { settings } from 'src/service/settings'
import { reinitialiseChat } from '../reinitialiseChat'

jest.mock('chat-web-sdk')

const executeReinitialiseChatWithMocks = ({
  withAuth = false,
  isLoggingOut = false,
  zChatConfig = {},
  chatAuthSettings = {},
} = {}) => {
  const dispatchSpy = jest.fn()
  const onSDKInitializedSpy = jest.fn()
  const getIsLoggingOutSpy = jest.fn(() => isLoggingOut)
  const getZChatVendorSpy = jest.fn(() => zChat)
  const getZChatConfigSpy = jest.fn(() => zChatConfig)
  const logoutForAllSpy = jest.fn()
  const onSpy = jest.fn()
  const getChatAuthSettingSpy = jest.fn(() => chatAuthSettings)
  const initSpy = jest.fn()
  const setOnFirstReadySpy = jest.fn()

  jest.spyOn(settings, 'getChatAuthSettings').mockImplementation(getChatAuthSettingSpy)
  jest.spyOn(chatSelectors, 'getIsLoggingOut').mockImplementation(getIsLoggingOutSpy)
  jest.spyOn(chatSelectors, 'getZChatVendor').mockImplementation(getZChatVendorSpy)
  jest.spyOn(baseSelectors, 'getZChatConfig').mockImplementation(getZChatConfigSpy)
  jest.spyOn(callbacks, 'onChatSDKInitialized').mockImplementation(onSDKInitializedSpy)

  jest.spyOn(zChat, 'endChat').mockImplementation((a) => a())
  jest.spyOn(zChat, 'logoutForAll').mockImplementation(logoutForAllSpy)
  jest.spyOn(zChat, 'on').mockImplementation(onSpy)
  jest.spyOn(zChat, 'init').mockImplementation(initSpy)
  jest.spyOn(zChat, 'setOnFirstReady').mockImplementation(setOnFirstReadySpy)

  const thunk = reinitialiseChat(withAuth)
  thunk(dispatchSpy, jest.fn())
  const bodyFunc = onSDKInitializedSpy.mock.calls[0][0]
  bodyFunc()

  return {
    dispatchSpy,
    logoutForAllSpy,
    onSpy,
    initSpy,
    setOnFirstReadySpy,
  }
}

describe('reinitialiseChat', () => {
  it('dispatches chat user logging out for current session', () => {
    const { dispatchSpy } = executeReinitialiseChatWithMocks({ withAuth: false })

    expect(dispatchSpy).toHaveBeenCalledWith({ type: actionTypes.CHAT_USER_LOGGING_OUT })
  })

  it('calls zChat.logoutForAll', () => {
    const { logoutForAllSpy } = executeReinitialiseChatWithMocks({ withAuth: false })

    expect(logoutForAllSpy).toHaveBeenCalled()
  })

  describe('connection update event', () => {
    const executeConnectionUpdateEvent = (
      isLoggingOut = false,
      connectionStatus = CONNECTION_STATUSES.CLOSED
    ) => {
      const spies = executeReinitialiseChatWithMocks({ withAuth: false, isLoggingOut })
      const handlerFunc = spies.onSpy.mock.calls[0][1]

      spies.dispatchSpy.mockClear() // Ignore previous calls outside handler function
      handlerFunc(connectionStatus)

      return spies
    }

    describe('when connected', () => {
      describe('when user is logging out', () => {
        it('dispatches CHAT_USER_LOGGED_OUT action', () => {
          const connectionStatus = CONNECTION_STATUSES.CONNECTED
          const isLoggingOut = true
          const { dispatchSpy } = executeConnectionUpdateEvent(isLoggingOut, connectionStatus)

          expect(dispatchSpy).toHaveBeenCalledWith({ type: actionTypes.CHAT_USER_LOGGED_OUT })
        })
      })

      describe('when user is not logging out', () => {
        it('does not dispatch CHAT_USER_LOGGED_OUT action', () => {
          const connectionStatus = CONNECTION_STATUSES.CONNECTED
          const isLoggingOut = false
          const { dispatchSpy } = executeConnectionUpdateEvent(isLoggingOut, connectionStatus)

          expect(dispatchSpy).not.toHaveBeenCalled()
        })
      })
    })

    describe('when not connected', () => {
      it('does not dispatch CHAT_USER_LOGGED_OUT action', () => {
        const connectionStatus = CONNECTION_STATUSES.CONNECTING
        const isLoggingOut = true
        const { dispatchSpy } = executeConnectionUpdateEvent(isLoggingOut, connectionStatus)

        expect(dispatchSpy).not.toHaveBeenCalled()
      })
    })
  })

  describe('when authentication is required in the next session', () => {
    describe('when authentication settings are actually provided', () => {
      it('calls zChat.init with authentication', () => {
        const zChatConfig = { chat: 'someconfig' }
        const jwtFnSpy = jest.fn()
        const chatAuthSettings = { jwtFn: jwtFnSpy }
        const { initSpy } = executeReinitialiseChatWithMocks({
          withAuth: true,
          zChatConfig,
          chatAuthSettings,
        })

        const authentication = { jwt_fn: jwtFnSpy }
        expect(initSpy).toHaveBeenCalledWith({ ...zChatConfig, authentication })
      })
    })

    describe('when authentication settings are not provided', () => {
      it('calls zChat.init without authentication', () => {
        const zChatConfig = { chat: 'someconfig' }
        const { initSpy } = executeReinitialiseChatWithMocks({ withAuth: true, zChatConfig })

        expect(initSpy).toHaveBeenCalledWith(zChatConfig)
      })
    })

    it('dispatches AUTHENTICATION_STARTED action', () => {
      const { dispatchSpy } = executeReinitialiseChatWithMocks({ withAuth: true })

      expect(dispatchSpy).toHaveBeenCalledWith({ type: actionTypes.AUTHENTICATION_STARTED })
    })

    it('calls zChat.setOnFirstReady', () => {
      const { setOnFirstReadySpy } = executeReinitialiseChatWithMocks({ withAuth: true })

      expect(setOnFirstReadySpy).toHaveBeenCalledWith({
        fetchHistory: expect.any(Function),
      })
    })

    describe('when zChat is ready', () => {
      it('dispatch fetchConversationHistory action', () => {
        const { setOnFirstReadySpy, dispatchSpy } = executeReinitialiseChatWithMocks({
          withAuth: true,
        })

        const callback = setOnFirstReadySpy.mock.calls[0][0].fetchHistory
        const historyAction = { type: 'mockedHistoryAction' }
        jest.spyOn(actions, 'fetchConversationHistory').mockImplementation(() => historyAction)

        callback()

        expect(dispatchSpy).toHaveBeenCalledWith(historyAction)
      })
    })
  })

  describe('when auth is not required in the next session', () => {
    it('calls zChat.init without authentication', () => {
      const zChatConfig = { chat: 'someconfig' }
      const { initSpy } = executeReinitialiseChatWithMocks({ withAuth: false, zChatConfig })

      expect(initSpy).toHaveBeenCalledWith(zChatConfig)
    })

    it('does not dispatch AUTHENTICATION_STARTED action', () => {
      const { dispatchSpy } = executeReinitialiseChatWithMocks({ withAuth: false })

      expect(dispatchSpy).not.toHaveBeenCalledWith({ type: actionTypes.AUTHENTICATION_STARTED })
    })

    it('does not call zChat.setOnFirstReady', () => {
      const { setOnFirstReadySpy } = executeReinitialiseChatWithMocks({ withAuth: false })

      expect(setOnFirstReadySpy).not.toHaveBeenCalled()
    })
  })
})
