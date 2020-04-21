import configureMockStore from 'redux-mock-store'
import thunk from 'redux-thunk'
import _ from 'lodash'

import * as timeout from 'src/redux/modules/chat/helpers/zChatWithTimeout'
import * as actions from '../actions'
import * as actionTypes from 'src/redux/modules/chat/chat-action-types'
import * as baseActionTypes from 'src/redux/modules/base/base-action-types'
import * as baseActions from 'src/redux/modules/base/base-actions/routing-actions'
import * as reselectors from 'src/redux/modules/chat/chat-selectors/reselectors'
import * as selectors from 'src/redux/modules/chat/chat-selectors/selectors'
import * as callbacks from 'service/api/callbacks'
import * as connectedSelectors from 'src/redux/modules/selectors/selectors'
import * as helpCenterSelectors from 'src/redux/modules/selectors/helpCenter-linked-selectors'
import zopimApi from 'service/api/zopimApi'
import * as zChat from 'chat-web-sdk'
import { win } from 'utility/globals'
import { isMobileBrowser } from 'utility/devices'

import {
  handleChatSDKInitialized,
  handleChatConnected,
  reset as resetChatSDKInitializedQueue
} from 'src/service/api/zopimApi/callbacks'

import {
  CHAT_CONNECTED_EVENT,
  CHAT_STARTED_EVENT,
  CHAT_UNREAD_MESSAGES_EVENT
} from 'constants/event'

const timeoutError = { code: 'ETIMEDOUT' }
const otherError = { code: 'DERP DERP', message: 'I gone derped up' }
const mockStore = configureMockStore([thunk])
const invoker = jest.fn()
const mockTimeout = jest.fn(() => invoker)
jest.mock('chat-web-sdk')
const getState = (state = {}) => {
  const defaults = {
    base: {
      embeddableConfig: {
        embeds: {
          chat: {
            props: {
              zopimId: 123
            }
          }
        }
      }
    },
    chat: {
      vendor: {
        zChat
      },
      accountSettings: {
        prechatForm: false
      }
    }
  }

  return _.merge(defaults, state)
}
jest.mock('utility/devices')

timeout.zChatWithTimeout = jest.fn(() => mockTimeout())

const dispatchZChatWithTimeoutAction = (action, ...callbackArgs) => {
  const store = mockStore(getState())

  store.dispatch(action)
  const timeoutArgs = invoker.mock.calls[0]
  const callback = timeoutArgs[timeoutArgs.length - 1]

  callback(...callbackArgs)

  return {
    store,
    timeoutArgs,
    callback
  }
}

const logoutDispatch = (action, status = 'connected') => {
  const store = mockStore(getState())
  const endChatSpy = jest.spyOn(zChat, 'endChat')
  const onSpy = jest.spyOn(zChat, 'on')

  store.dispatch(action)

  const endChatCallback = endChatSpy.mock.calls[0][0]
  endChatCallback()

  const onCallback = onSpy.mock.calls[0][1]
  onCallback(status)

  return store
}

const dispatchAction = (action, initialState = {}) => {
  const store = mockStore(getState(initialState))

  store.dispatch(action)

  return store.getActions()
}

describe('endChat', () => {
  const payload = { agent: 'smith' }
  const happyPathActions = expectedVisibilityPayload => {
    return [
      {
        type: actionTypes.CHAT_ALL_AGENTS_INACTIVE,
        payload
      },
      {
        type: actionTypes.END_CHAT_REQUEST_SUCCESS
      },
      {
        payload: expectedVisibilityPayload,
        type: baseActionTypes.UPDATE_BACK_BUTTON_VISIBILITY
      }
    ]
  }

  beforeEach(() => {
    jest.spyOn(reselectors, 'getActiveAgents').mockReturnValue(payload)
  })

  const verifyCallbackCalled = () => {
    it('calls the callback', () => {
      jest.spyOn(helpCenterSelectors, 'getHelpCenterAvailable').mockReturnValue(true)
      const callback = jest.fn()

      dispatchZChatWithTimeoutAction(actions.endChat(callback))

      expect(callback).toHaveBeenCalled()
    })
  }

  describe('when there are no other available channels', () => {
    beforeEach(() => {
      jest.spyOn(helpCenterSelectors, 'getHelpCenterAvailable').mockReturnValue(false)
      jest.spyOn(connectedSelectors, 'getChannelChoiceAvailable').mockReturnValue(false)
    })

    it('dispatches UPDATE_BACK_BUTTON_VISIBILITY with false payload', () => {
      const { store } = dispatchZChatWithTimeoutAction(actions.endChat())

      expect(store.getActions()).toEqual(
        expect.arrayContaining([
          {
            payload: false,
            type: baseActionTypes.UPDATE_BACK_BUTTON_VISIBILITY
          }
        ])
      )
    })
  })

  describe('when there are other channels available', () => {
    it('dispatches UPDATE_BACK_BUTTON_VISIBILITY with true payload', () => {
      jest.spyOn(helpCenterSelectors, 'getHelpCenterAvailable').mockReturnValue(true)
      const { store } = dispatchZChatWithTimeoutAction(actions.endChat())

      expect(store.getActions()).toEqual(
        expect.arrayContaining([
          {
            payload: true,
            type: baseActionTypes.UPDATE_BACK_BUTTON_VISIBILITY
          }
        ])
      )
    })
  })

  describe('when there are no errors', () => {
    it('dispatches CHAT_ALL_AGENTS_INACTIVE and END_CHAT_REQUEST_SUCCESS', () => {
      jest.spyOn(helpCenterSelectors, 'getHelpCenterAvailable').mockReturnValue(true)
      jest.spyOn(callbacks, 'fireFor')
      const { store } = dispatchZChatWithTimeoutAction(actions.endChat())

      expect(store.getActions()).toEqual(happyPathActions(true))
    })

    verifyCallbackCalled()
  })

  describe('when there is an error', () => {
    describe("when it's a timeout error", () => {
      it('dispatches CHAT_ALL_AGENTS_INACTIVE and END_CHAT_REQUEST_SUCCESS', () => {
        jest.spyOn(helpCenterSelectors, 'getHelpCenterAvailable').mockReturnValue(true)
        jest.spyOn(callbacks, 'fireFor')
        const { store } = dispatchZChatWithTimeoutAction(actions.endChat(), timeoutError)

        expect(store.getActions()).toEqual(happyPathActions(true))
      })

      verifyCallbackCalled()
    })

    describe('when it is not a timeout error', () => {
      it('dispatches END_CHAT_REQUEST_FAILURE', () => {
        const { store } = dispatchZChatWithTimeoutAction(actions.endChat(), otherError)

        expect(store.getActions()).toEqual([{ type: actionTypes.END_CHAT_REQUEST_FAILURE }])
      })

      verifyCallbackCalled()
    })
  })
})

describe('setVisitorInfo', () => {
  const mockVisitor = { name: 'Belgarion', email: 'garion@riva.com' }
  const mockTimestamp = 1234
  const mockRequestSuccessAction = {
    type: actionTypes.SET_VISITOR_INFO_REQUEST_SUCCESS,
    payload: { ...mockVisitor, timestamp: mockTimestamp }
  }

  beforeEach(() => {
    handleChatSDKInitialized()
  })

  afterEach(() => {
    resetChatSDKInitializedQueue()
  })

  describe('if authenticated', () => {
    beforeEach(() => {
      jest.spyOn(selectors, 'getIsAuthenticated').mockReturnValue(true)
    })

    describe('if not updating the phone number', () => {
      it('does not dispatch any actions', () => {
        const store = mockStore(getState())

        store.dispatch(actions.setVisitorInfo(mockVisitor, { type: 'w00t' }, mockTimestamp))

        expect(store.getActions()).toEqual([])
      })
    })
  })

  describe('if not authenticated or if phone number is provided', () => {
    beforeEach(() => {
      jest.spyOn(selectors, 'getIsAuthenticated').mockReturnValue(false)
    })

    it('updates the phone number when the user is authenticated', () => {
      jest.spyOn(selectors, 'getIsAuthenticated').mockReturnValue(true)
      const store = mockStore(getState())

      const vistor = {
        name: 'Someone',
        phone: '123'
      }

      store.dispatch(actions.setVisitorInfo(vistor, {}, 1234))
      expect(store.getActions()).toEqual([
        {
          type: actionTypes.SET_VISITOR_INFO_REQUEST_PENDING,
          payload: { phone: '123', timestamp: mockTimestamp }
        }
      ])
    })

    it('dispatches SET_VISITOR_INFO_REQUEST_PENDING', () => {
      const store = mockStore(getState())

      store.dispatch(actions.setVisitorInfo(mockVisitor, {}, 1234))
      expect(store.getActions()).toEqual([
        {
          type: actionTypes.SET_VISITOR_INFO_REQUEST_PENDING,
          payload: { ...mockVisitor, timestamp: mockTimestamp }
        }
      ])
    })

    it('passes in the visitor as an argument', () => {
      const { timeoutArgs } = dispatchZChatWithTimeoutAction(
        actions.setVisitorInfo(mockVisitor, null, mockTimestamp)
      )

      expect(timeoutArgs[0]).toEqual(mockVisitor)
    })

    describe("when there's any error", () => {
      it('dispatches SET_VISITOR_INFO_REQUEST_FAILURE', () => {
        const { store } = dispatchZChatWithTimeoutAction(
          actions.setVisitorInfo(mockVisitor, null, mockTimestamp),
          otherError
        )

        expect(store.getActions()).toContainEqual({
          type: actionTypes.SET_VISITOR_INFO_REQUEST_FAILURE
        })
      })
    })

    describe('when there are no errors', () => {
      it('dispatches SET_VISITOR_INFO_REQUEST_SUCCESS', () => {
        const { store } = dispatchZChatWithTimeoutAction(
          actions.setVisitorInfo(mockVisitor, null, mockTimestamp)
        )

        expect(store.getActions()).toContainEqual(mockRequestSuccessAction)
      })

      describe('when an on-success action "callback" is passed', () => {
        it('dispatches the on-success action', () => {
          const { store } = dispatchZChatWithTimeoutAction(
            actions.setVisitorInfo(mockVisitor, { type: 'COOL_ACTION' }, mockTimestamp)
          )

          expect(store.getActions()).toContainEqual({ type: 'COOL_ACTION' })
        })
      })
    })
  })
})

describe('sendChatRating', () => {
  const mockRating = 4
  const mockSuccessAction = {
    type: actionTypes.CHAT_RATING_REQUEST_SUCCESS,
    payload: mockRating
  }

  describe('when there are no errors', () => {
    it('dispatches a CHAT_RATING_REQUEST_SUCCESS action', () => {
      const { store } = dispatchZChatWithTimeoutAction(actions.sendChatRating(mockRating))

      expect(store.getActions()).toEqual([mockSuccessAction])
    })
  })

  describe('when there is an error', () => {
    describe("when it's a timeout error", () => {
      it('dispatches CHAT_RATING_REQUEST_SUCCESS action anyway', () => {
        const { store } = dispatchZChatWithTimeoutAction(
          actions.sendChatRating(mockRating),
          timeoutError
        )

        expect(store.getActions()).toEqual([mockSuccessAction])
      })
    })

    describe('when it is any other error', () => {
      it('dispatches a CHAT_RATING_REQUEST_FAILURE action', () => {
        const { store } = dispatchZChatWithTimeoutAction(
          actions.sendChatRating(mockRating),
          otherError
        )

        expect(store.getActions()).toEqual([
          {
            type: actionTypes.CHAT_RATING_REQUEST_FAILURE
          }
        ])
      })
    })
  })
})

describe('sendChatComment', () => {
  const mockComment = "I'm selling these fine leather jackets..."
  const mockSuccessAction = {
    type: actionTypes.CHAT_RATING_COMMENT_REQUEST_SUCCESS,
    payload: mockComment
  }

  describe('when there are no errors', () => {
    it('dispatches CHAT_RATING_COMMENT_REQUEST_SUCCESS', () => {
      const { store } = dispatchZChatWithTimeoutAction(actions.sendChatComment(mockComment))

      expect(store.getActions()).toEqual([mockSuccessAction])
    })
  })

  describe('when there is an error', () => {
    describe("when it's a timeout error", () => {
      it('dispatches CHAT_RATING_COMMENT_REQUEST_SUCCESS anyway', () => {
        const { store } = dispatchZChatWithTimeoutAction(
          actions.sendChatComment(mockComment),
          timeoutError
        )

        expect(store.getActions()).toEqual([mockSuccessAction])
      })
    })

    describe("when it's any other error", () => {
      it('dispatches CHAT_RATING_COMMENT_REQUEST_FAILURE', () => {
        const { store } = dispatchZChatWithTimeoutAction(
          actions.sendChatComment(mockComment),
          otherError
        )

        expect(store.getActions()).toEqual([
          {
            type: actionTypes.CHAT_RATING_COMMENT_REQUEST_FAILURE
          }
        ])
      })
    })
  })
})

describe('sendAttachments', () => {
  const mockVisitor = {
    name: 'Ronnie James Dio',
    email: 'the_horns@example.com',
    nick: 'theDio',
    display_name: 'Dio'
  }
  const mockBasePayload = {
    type: 'chat.file',
    timestamp: 123456,
    nick: mockVisitor.nick,
    display_name: mockVisitor.display_name
  }
  const mockFileList = [
    {
      name: 'super-sekret-accountings.xls',
      size: 666
    }
  ]

  beforeEach(() => {
    jest.spyOn(selectors, 'getChatVisitor').mockReturnValue(mockVisitor)
    Date.now = jest.fn(() => mockBasePayload.timestamp)
  })

  it('dispatches CHAT_FILE_REQUEST_SENT for each file in the list', () => {
    const store = mockStore(getState())

    store.dispatch(actions.sendAttachments(mockFileList))
    expect(store.getActions()).toMatchSnapshot()
  })

  describe('when there are no errors', () => {
    beforeEach(() => {
      jest.spyOn(zChat, 'sendFile').mockImplementation((file, callback) => {
        callback(false, { url: 'dio.example.com' })
      })
    })

    it('dispatches CHAT_FILE_REQUEST_SUCCESS for each file in the list', () => {
      const store = mockStore(getState())
      store.dispatch(actions.sendAttachments(mockFileList))

      expect(store.getActions()).toMatchSnapshot()
    })
  })

  describe('when there is an error', () => {
    beforeEach(() => {
      jest.spyOn(zChat, 'sendFile').mockImplementation((file, callback) => {
        callback(new Error('some error'), null)
      })
    })

    it('dispatches CHAT_FILE_REQUEST_FAILURE for each file in the list', () => {
      const store = mockStore(getState())
      store.dispatch(actions.sendAttachments(mockFileList))

      expect(store.getActions()).toMatchSnapshot()
    })
  })
})

describe('setDepartment', () => {
  const mockDeptId = 1
  const mockSuccessCallback = jest.fn()
  const mockErrCallback = jest.fn()

  it('dispatches VISITOR_DEFAULT_DEPARTMENT_SELECTED', () => {
    const { store } = dispatchZChatWithTimeoutAction(
      actions.setDepartment(mockDeptId, mockSuccessCallback, mockErrCallback)
    )

    expect(store.getActions()).toEqual([
      {
        type: actionTypes.VISITOR_DEFAULT_DEPARTMENT_SELECTED,
        payload: {
          department: mockDeptId
        }
      }
    ])
  })

  describe('when there are no errors', () => {
    it('calls the success callback', () => {
      dispatchZChatWithTimeoutAction(
        actions.setDepartment(mockDeptId, mockSuccessCallback, mockErrCallback)
      )

      expect(mockSuccessCallback).toHaveBeenCalled()
      expect(mockErrCallback).not.toHaveBeenCalled()
    })
  })

  describe('when there is an error', () => {
    it('calls the error callback', () => {
      dispatchZChatWithTimeoutAction(
        actions.setDepartment(mockDeptId, mockSuccessCallback, mockErrCallback),
        timeoutError
      )

      expect(mockSuccessCallback).not.toHaveBeenCalled()
      expect(mockErrCallback).toHaveBeenCalledWith(timeoutError)
    })
  })
})

describe('clearDepartment', () => {
  const verifyCallbackCalled = () => {
    it('executes the success callback', () => {
      const mockSuccessCallback = jest.fn()

      dispatchZChatWithTimeoutAction(actions.clearDepartment(mockSuccessCallback))

      expect(mockSuccessCallback).toHaveBeenCalled()
    })
  }

  describe('when there is an error', () => {
    verifyCallbackCalled()
  })

  describe('when there are no errors', () => {
    verifyCallbackCalled()
  })
})

describe('sendOfflineMessage', () => {
  const mockPhone = 123456
  const mockFormState = {
    name: 'Charles Darwin',
    phone: mockPhone
  }
  const mockSuccessCallback = jest.fn()
  const mockFailureCallback = jest.fn()

  it('dispatches OFFLINE_FORM_REQUEST_SENT', () => {
    const { store } = dispatchZChatWithTimeoutAction(
      actions.sendOfflineMessage(mockFormState, mockSuccessCallback, mockFailureCallback)
    )

    expect(store.getActions()).toContainEqual({
      type: actionTypes.OFFLINE_FORM_REQUEST_SENT
    })
  })

  describe('when there are no errors', () => {
    it('dispatches OFFLINE_FORM_REQUEST_SUCCESS', () => {
      const { store } = dispatchZChatWithTimeoutAction(
        actions.sendOfflineMessage(mockFormState, mockSuccessCallback, mockFailureCallback)
      )

      expect(store.getActions()).toContainEqual({
        type: actionTypes.OFFLINE_FORM_REQUEST_SUCCESS,
        payload: mockFormState
      })
    })

    it('calls the success callback', () => {
      dispatchZChatWithTimeoutAction(
        actions.sendOfflineMessage(mockFormState, mockSuccessCallback, mockFailureCallback)
      )

      expect(mockSuccessCallback).toHaveBeenCalled()
    })
  })

  describe('when there is an error', () => {
    it('dispatches OFFLINE_FORM_REQUEST_FAILURE', () => {
      const { store } = dispatchZChatWithTimeoutAction(
        actions.sendOfflineMessage(mockFormState, mockSuccessCallback, mockFailureCallback),
        timeoutError
      )

      expect(store.getActions()).toContainEqual({
        type: actionTypes.OFFLINE_FORM_REQUEST_FAILURE
      })
    })

    it('executes the failure callback', () => {
      dispatchZChatWithTimeoutAction(
        actions.sendOfflineMessage(mockFormState, mockSuccessCallback, mockFailureCallback),
        timeoutError
      )

      expect(mockFailureCallback).toHaveBeenCalled()
    })
  })

  describe('the formState object', () => {
    describe('when the formState contains a phone number', () => {
      it('leaves it in the object and passes it to the callback', () => {
        const { timeoutArgs } = dispatchZChatWithTimeoutAction(
          actions.sendOfflineMessage(mockFormState, mockSuccessCallback, mockFailureCallback)
        )

        expect(timeoutArgs[0]).toEqual(mockFormState)
        expect(timeoutArgs[0].phone).toEqual(mockPhone)
      })
    })

    describe('when the formState contains no phone number', () => {
      it('deletes the key from the state object before passing it to the callback', () => {
        mockFormState.phone = null
        const { timeoutArgs } = dispatchZChatWithTimeoutAction(
          actions.sendOfflineMessage(mockFormState, mockSuccessCallback, mockFailureCallback)
        )

        expect(timeoutArgs[0].phone).toBeUndefined()
      })
    })
  })
})

describe('fetchConversationHistory', () => {
  const mockHistory = []
  const mockData = {
    history: mockHistory
  }

  it('dispatches HISTORY_REQUEST_SENT', () => {
    const { store } = dispatchZChatWithTimeoutAction(
      actions.fetchConversationHistory(),
      null,
      mockData
    )

    expect(store.getActions()).toContainEqual({
      type: actionTypes.HISTORY_REQUEST_SENT
    })
  })

  describe('when there are no errors', () => {
    it('dispatches HISTORY_REQUEST_SUCCESS', () => {
      const { store } = dispatchZChatWithTimeoutAction(
        actions.fetchConversationHistory(),
        null,
        mockData
      )

      expect(store.getActions()).toContainEqual({
        type: actionTypes.HISTORY_REQUEST_SUCCESS,
        payload: { ...mockData }
      })
    })
  })

  describe('when there is an error', () => {
    describe("when it's a timeout error", () => {
      it('dispatches HISTORY_REQUEST_SUCCESS anyway', () => {
        const { store } = dispatchZChatWithTimeoutAction(
          actions.fetchConversationHistory(),
          timeoutError,
          undefined
        )

        expect(store.getActions()).toContainEqual({
          type: actionTypes.HISTORY_REQUEST_SUCCESS,
          payload: { ...mockData }
        })
      })
    })

    describe("when it's any other error", () => {
      it('dispatches HISTORY_REQUEST_FAILURE', () => {
        const { store } = dispatchZChatWithTimeoutAction(
          actions.fetchConversationHistory(),
          otherError,
          undefined
        )

        expect(store.getActions()).toContainEqual({
          type: actionTypes.HISTORY_REQUEST_FAILURE,
          payload: otherError
        })
      })
    })
  })
})

describe('initiateSocialLogout', () => {
  const successAction = { type: actionTypes.CHAT_SOCIAL_LOGOUT_SUCCESS }
  const failureAction = { type: actionTypes.CHAT_SOCIAL_LOGOUT_FAILURE }

  it('dispatches CHAT_SOCIAL_LOGOUT_PENDING', () => {
    const { store } = dispatchZChatWithTimeoutAction(actions.initiateSocialLogout())

    expect(store.getActions()).toContainEqual({
      type: actionTypes.CHAT_SOCIAL_LOGOUT_PENDING
    })
  })

  describe('when there are no errors', () => {
    it('dispatches CHAT_SOCIAL_LOGOUT_SUCCESS', () => {
      const { store } = dispatchZChatWithTimeoutAction(actions.initiateSocialLogout())
      const dispatchedActions = store.getActions()

      expect(dispatchedActions).toContainEqual(successAction)
      expect(dispatchedActions).not.toContainEqual(failureAction)
    })
  })

  describe('when there is an error', () => {
    const { store } = dispatchZChatWithTimeoutAction(actions.initiateSocialLogout(), timeoutError)

    const dispatchedActions = store.getActions()

    expect(dispatchedActions).toContainEqual(failureAction)
    expect(dispatchedActions).not.toContainEqual(successAction)
  })
})

describe('chatLogout', () => {
  describe('when authenticated', () => {
    it('calls endChat', () => {
      const store = mockStore(getState())
      jest.spyOn(zChat, 'endChat')

      store.dispatch(actions.chatLogout())

      expect(zChat.endChat).not.toHaveBeenCalled()

      handleChatSDKInitialized()

      expect(zChat.endChat).toHaveBeenCalled()

      resetChatSDKInitializedQueue()
    })

    describe('Web SDK callback', () => {
      beforeEach(() => {
        handleChatSDKInitialized()
      })

      afterEach(() => {
        resetChatSDKInitializedQueue()
      })

      it('dispatches an action with type CHAT_USER_LOGGING_OUT', () => {
        const store = logoutDispatch(actions.chatLogout())

        expect(store.getActions()).toContainEqual({
          type: actionTypes.CHAT_USER_LOGGING_OUT
        })
      })

      it('calls logoutForAll', () => {
        logoutDispatch(actions.chatLogout())

        expect(zChat.logoutForAll).toHaveBeenCalled()
      })

      it('calls init with correct args', () => {
        logoutDispatch(actions.chatLogout())

        expect(zChat.init).toHaveBeenCalledWith({
          account_key: 123,
          activity_window: win
        })
      })

      it('calls the "on" api with the correct args', () => {
        logoutDispatch(actions.chatLogout())

        expect(zChat.on).toHaveBeenCalledWith('connection_update', expect.any(Function))
      })

      describe('on callback', () => {
        describe('when connection status is connected', () => {
          describe('when user is logging out', () => {
            beforeEach(() => {
              jest.spyOn(selectors, 'getIsLoggingOut').mockReturnValue(true)
            })

            it('dispatches an action with type CHAT_USER_LOGGED_OUT', () => {
              const store = logoutDispatch(actions.chatLogout(), 'connected')

              expect(store.getActions()).toContainEqual({
                type: actionTypes.CHAT_USER_LOGGED_OUT
              })
            })
          })

          describe('when user is not logging out', () => {
            beforeEach(() => {
              jest.spyOn(selectors, 'getIsLoggingOut').mockReturnValue(false)
            })

            it('does not dispatch an action with type CHAT_USER_LOGGED_OUT', () => {
              const store = logoutDispatch(actions.chatLogout(), 'connected')

              expect(store.getActions()).not.toContainEqual({
                type: actionTypes.CHAT_USER_LOGGED_OUT
              })
            })
          })
        })

        describe('when connection status is not connected', () => {
          describe('when user is logging out', () => {
            beforeEach(() => {
              jest.spyOn(selectors, 'getIsLoggingOut').mockReturnValue(true)
            })

            it('does not dispatch an action with type CHAT_USER_LOGGED_OUT', () => {
              const store = logoutDispatch(actions.chatLogout(), 'closed')

              expect(store.getActions()).not.toContainEqual({
                type: actionTypes.CHAT_USER_LOGGED_OUT
              })
            })
          })

          describe('when user is not logging out', () => {
            beforeEach(() => {
              jest.spyOn(selectors, 'getIsLoggingOut').mockReturnValue(false)
            })

            it('does not dispatch an action with type CHAT_USER_LOGGED_OUT', () => {
              const store = logoutDispatch(actions.chatLogout(), 'closed')

              expect(store.getActions()).not.toContainEqual({
                type: actionTypes.CHAT_USER_LOGGED_OUT
              })
            })
          })
        })
      })
    })
  })
})

describe('editContactDetailsSubmitted', () => {
  const mockVisitor = {
    name: 'Boromir',
    email: 'dadsfav@gondor.gd'
  }

  beforeEach(() => {
    Date.now = () => 123456
    handleChatSDKInitialized()
  })

  afterEach(() => {
    resetChatSDKInitializedQueue()
  })

  it('dispatches SET_VISITOR_INFO_REQUEST_SUCCESS and CHAT_CONTACT_DETAILS_UPDATE_SUCCESS', () => {
    const { store } = dispatchZChatWithTimeoutAction(
      actions.editContactDetailsSubmitted(mockVisitor)
    )
    const dispatchedActions = store.getActions()

    expect(dispatchedActions).toContainEqual({
      type: actionTypes.CHAT_CONTACT_DETAILS_UPDATE_SUCCESS,
      payload: { ...mockVisitor, timestamp: Date.now() }
    })

    expect(dispatchedActions).toContainEqual({
      type: actionTypes.SET_VISITOR_INFO_REQUEST_SUCCESS,
      payload: { ...mockVisitor, timestamp: Date.now() }
    })
  })
})

describe('openedChatHistory', () => {
  it('dispatches OPENED_CHAT_HISTORY', () => {
    const result = dispatchAction(actions.openedChatHistory())[0]

    expect(result).toEqual({ type: actionTypes.OPENED_CHAT_HISTORY })
  })
})

describe('closedChatHistory', () => {
  it('dispatches CLOSED_CHAT_HISTORY', () => {
    const result = dispatchAction(actions.closedChatHistory())[0]

    expect(result).toEqual({ type: actionTypes.CLOSED_CHAT_HISTORY })
  })
})

test('chatConnected', () => {
  jest.spyOn(callbacks, 'fireFor')
  jest.spyOn(zopimApi, 'handleChatConnected')
  const result = dispatchAction(actions.chatConnected())[0]

  expect(zopimApi.handleChatConnected).toHaveBeenCalled()
  expect(callbacks.fireFor).toHaveBeenCalledWith(CHAT_CONNECTED_EVENT)
  expect(result).toEqual({ type: actionTypes.CHAT_CONNECTED })
})

test('chatStarted', () => {
  jest.spyOn(callbacks, 'fireFor')
  jest.spyOn(baseActions, 'updateBackButtonVisibility')
  jest.spyOn(helpCenterSelectors, 'getHelpCenterAvailable').mockReturnValue(true)

  const result = dispatchAction(actions.chatStarted())[0]

  expect(callbacks.fireFor).toHaveBeenCalledWith(CHAT_STARTED_EVENT)
  expect(result).toEqual({ type: actionTypes.CHAT_STARTED })
  expect(baseActions.updateBackButtonVisibility).toHaveBeenCalledWith(true)

  baseActions.updateBackButtonVisibility.mockRestore()
})

test('newAgentMessageReceived', () => {
  jest.spyOn(callbacks, 'fireFor')
  const result = dispatchAction(actions.newAgentMessageReceived('yeet'))[0]

  expect(callbacks.fireFor).toHaveBeenCalledWith(CHAT_UNREAD_MESSAGES_EVENT)
  expect(result).toEqual({
    type: actionTypes.NEW_AGENT_MESSAGE_RECEIVED,
    payload: 'yeet'
  })
})

describe('proactiveMessageReceived', () => {
  it('dispatches expected actions when not hidden', () => {
    const results = dispatchAction(actions.proactiveMessageReceived(), {
      base: {
        hidden: {
          hideApi: false
        }
      }
    })

    expect(results).toMatchInlineSnapshot(`
            Array [
              Object {
                "type": "widget/chat/PROACTIVE_CHAT_RECEIVED",
              },
              Object {
                "type": "widget/base/SHOW_WIDGET",
              },
              Object {
                "payload": "chat",
                "type": "widget/base/UPDATE_ACTIVE_EMBED",
              },
              Object {
                "payload": Object {
                  "screen": "widget/chat/CHATTING_SCREEN",
                },
                "type": "widget/chat/UPDATE_CHAT_SCREEN",
              },
            ]
        `)
  })

  it('dispatches expected actions when hidden', () => {
    const results = dispatchAction(actions.proactiveMessageReceived(), {
      base: {
        hidden: {
          hideApi: true
        }
      }
    })

    expect(results).toMatchInlineSnapshot(`
      Array [
        Object {
          "type": "widget/chat/PROACTIVE_CHAT_RECEIVED",
        },
        Object {
          "payload": "chat",
          "type": "widget/base/UPDATE_ACTIVE_EMBED",
        },
        Object {
          "payload": Object {
            "screen": "widget/chat/CHATTING_SCREEN",
          },
          "type": "widget/chat/UPDATE_CHAT_SCREEN",
        },
      ]
    `)
  })

  it('dispatches expected actions when on mobile', () => {
    isMobileBrowser.mockReturnValue(true)
    const results = dispatchAction(actions.proactiveMessageReceived(), {
      base: {
        hidden: {
          hideApi: false
        }
      }
    })

    expect(results).toMatchInlineSnapshot(`
      Array [
        Object {
          "type": "widget/chat/PROACTIVE_CHAT_RECEIVED",
        },
        Object {
          "type": "widget/base/SHOW_WIDGET",
        },
        Object {
          "payload": "chat",
          "type": "widget/base/UPDATE_ACTIVE_EMBED",
        },
        Object {
          "payload": Object {
            "screen": "widget/chat/CHATTING_SCREEN",
          },
          "type": "widget/chat/UPDATE_CHAT_SCREEN",
        },
        Object {
          "type": "widget/chat/SHOW_STANDALONE_MOBILE_NOTIFICATION",
        },
      ]
    `)
  })
})

describe('sendVisitorPath', () => {
  beforeEach(() => {
    handleChatConnected()
    jest.spyOn(zChat, 'sendVisitorPath')
  })

  afterEach(() => {
    resetChatSDKInitializedQueue()
  })

  const dispatchAction = arg => {
    const store = mockStore(getState())
    store.dispatch(actions.sendVisitorPath(arg))
    return store
  }

  describe('passed in arguments', () => {
    it('calls zChat.sendVisitorPath with expected parameters', () => {
      const page = { title: 'this title', url: 'http://us.com' }
      dispatchAction(page)
      expect(zChat.sendVisitorPath).toHaveBeenCalledWith(page, expect.any(Function))
    })

    describe('invalid title', () => {
      it('calls zChat with page title', () => {
        document.title = 'hello world'
        dispatchAction({ title: 123, url: 'http://us.com' })
        expect(zChat.sendVisitorPath).toHaveBeenCalledWith(
          { title: 'hello world', url: 'http://us.com' },
          expect.any(Function)
        )
      })

      it('calls zChat.sendVisitorPath with placeholder if no title is found', () => {
        document.title = ''
        dispatchAction({ title: 123, url: 'http://us.com' })
        expect(zChat.sendVisitorPath).toHaveBeenCalledWith(
          { title: 'http://us.com', url: 'http://us.com' },
          expect.any(Function)
        )
      })
    })

    describe('invalid url', () => {
      it('calls zChat with page title', () => {
        dispatchAction({ title: '123', url: 'httpus.com' })
        expect(zChat.sendVisitorPath).toHaveBeenCalledWith(
          { title: '123', url: 'http://localhost/' },
          expect.any(Function)
        )
      })
    })
  })

  describe('no arguments', () => {
    it('calls zChat with host page info', () => {
      document.title = 'hello world'
      dispatchAction()
      expect(zChat.sendVisitorPath).toHaveBeenCalledWith(
        { title: 'hello world', url: 'http://localhost/' },
        expect.any(Function)
      )
    })
  })

  describe('callbacks', () => {
    it('dispatches expected actions on success', () => {
      jest.spyOn(zChat, 'sendVisitorPath').mockImplementation((page, cb) => {
        cb()
      })
      const page = { title: 'this title', url: 'http://us.com' }
      const store = dispatchAction(page)
      expect(store.getActions()).toMatchInlineSnapshot(`
        Array [
          Object {
            "payload": Object {
              "title": "this title",
              "url": "http://us.com",
            },
            "type": "widget/chat/SEND_VISITOR_PATH_REQUEST_SUCCESS",
          },
        ]
      `)
    })

    it('dispatches expected actions on failure', () => {
      jest.spyOn(zChat, 'sendVisitorPath').mockImplementation((page, cb) => {
        cb({ error: 'hello' })
      })
      const page = { title: 'this title', url: 'http://us.com' }
      const store = dispatchAction(page)
      expect(store.getActions()).toMatchInlineSnapshot(`
        Array [
          Object {
            "type": "widget/chat/SEND_VISITOR_PATH_REQUEST_FAILURE",
          },
        ]
      `)
    })
  })
})

describe('chatDropped', () => {
  it('dispatches CHAT_DROPPED', () => {
    const result = dispatchAction(actions.chatDropped())[0]

    expect(result).toEqual({ type: actionTypes.CHAT_DROPPED })
  })
})

describe('chatNotificationTimedOut', () => {
  it('dispatches PROACTIVE_CHAT_NOTIFICATION_DISMISSED when getStandaloneMobileNotificationVisible is true', () => {
    jest.spyOn(selectors, 'getNotification').mockReturnValue({ show: true })
    jest.spyOn(selectors, 'getStandaloneMobileNotificationVisible').mockReturnValue(true)

    const result = dispatchAction(actions.chatNotificationTimedOut())[0]

    expect(result).toEqual({ type: 'widget/chat/PROACTIVE_CHAT_NOTIFICATION_DISMISSED' })
  })

  it('dispatches CHAT_NOTIFICATION_DISMISSED when getStandaloneMobileNotificationVisible is false', () => {
    jest.spyOn(selectors, 'getNotification').mockReturnValue({ show: true })
    jest.spyOn(selectors, 'getStandaloneMobileNotificationVisible').mockReturnValue(false)

    const result = dispatchAction(actions.chatNotificationTimedOut())[0]

    expect(result).toEqual({ type: 'widget/chat/CHAT_NOTIFICATION_DISMISSED' })
  })

  it('dispatches nothing when getNotification show is false', () => {
    jest.spyOn(selectors, 'getNotification').mockReturnValue({ show: false })
    jest.spyOn(selectors, 'getStandaloneMobileNotificationVisible').mockReturnValue(false)

    const result = dispatchAction(actions.chatNotificationTimedOut())

    expect(result).toEqual([])
  })
})

describe('sendMsg', () => {
  const mockVisitor = {
    name: 'Boromir',
    email: 'dadsfav@gondor.gd'
  }

  beforeEach(() => {
    jest.spyOn(selectors, 'getChatVisitor').mockReturnValue(mockVisitor)
  })

  afterEach(() => {
    resetChatSDKInitializedQueue()
  })

  describe('when chat is connected', () => {
    it('fires off a CHAT_MSG_REQUEST_SENT action', () => {
      handleChatConnected()
      const result = dispatchAction(actions.sendMsg('boop'))
      expect(result[0].type).toEqual('widget/chat/CHAT_MSG_REQUEST_SENT')
    })
  })

  describe('when chat is not connected', () => {
    it('does not fire any actions', () => {
      const result = dispatchAction(actions.sendMsg('boop'))
      expect(result).toEqual([])
    })

    it('after connection, fires the action', () => {
      const result = dispatchAction(actions.sendMsg('boop'))
      expect(result).toEqual([])
      handleChatConnected()
      expect(result[0].type).toEqual('widget/chat/CHAT_MSG_REQUEST_SENT')
    })
  })
})

describe('sendChatBadgeMessage', () => {
  const mockVisitor = {
    name: 'Boromir',
    email: 'dadsfav@gondor.gd'
  }

  beforeEach(() => {
    jest.spyOn(selectors, 'getChatVisitor').mockReturnValue(mockVisitor)
  })

  afterEach(() => {
    resetChatSDKInitializedQueue()
  })

  describe('when chat is connected', () => {
    describe('prechat form is not required', () => {
      it('fires off expected actions', () => {
        handleChatConnected()
        const results = dispatchAction(actions.sendChatBadgeMessage('boop'), {
          chat: {
            accountSettings: {
              prechatForm: {
                required: false
              }
            }
          }
        })

        expect(results).toMatchInlineSnapshot(`
          Array [
            Object {
              "payload": Object {
                "screen": "widget/chat/CHATTING_SCREEN",
              },
              "type": "widget/chat/UPDATE_CHAT_SCREEN",
            },
            Object {
              "payload": Object {
                "detail": Object {
                  "display_name": undefined,
                  "msg": "boop",
                  "nick": undefined,
                  "timestamp": 123456,
                  "type": "chat.msg",
                },
                "status": "CHAT_MESSAGE_PENDING",
              },
              "type": "widget/chat/CHAT_MSG_REQUEST_SENT",
            },
            Object {
              "type": "widget/chat/RESET_CURRENT_MESSAGE",
            },
          ]
        `)
      })
    })

    describe('prechat form is required', () => {
      it('dispatches expected actions', () => {
        handleChatConnected()
        const results = dispatchAction(actions.sendChatBadgeMessage('boop'), {
          chat: {
            accountSettings: {
              prechatForm: {
                required: true
              }
            }
          }
        })
        expect(results).toMatchInlineSnapshot(`
          Array [
            Object {
              "payload": Object {
                "screen": "widget/chat/PRECHAT_SCREEN",
              },
              "type": "widget/chat/UPDATE_CHAT_SCREEN",
            },
          ]
        `)
      })
    })
  })

  describe('when chat is not connected', () => {
    it('does not fire any actions', () => {
      const results = dispatchAction(actions.sendChatBadgeMessage('boop'))

      expect(results).toEqual([])
    })

    it('after connection, fires the action', () => {
      const results = dispatchAction(actions.sendChatBadgeMessage('boop'), {
        chat: {
          accountSettings: {
            prechatForm: {
              required: true
            }
          }
        }
      })

      expect(results).toEqual([])
      handleChatConnected()
      expect(results).toMatchInlineSnapshot(`
        Array [
          Object {
            "payload": Object {
              "screen": "widget/chat/PRECHAT_SCREEN",
            },
            "type": "widget/chat/UPDATE_CHAT_SCREEN",
          },
        ]
      `)
    })
  })
})
