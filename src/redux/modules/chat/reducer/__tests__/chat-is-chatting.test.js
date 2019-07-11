import * as actions from 'src/redux/modules/chat/chat-action-types'
import { store } from 'service/persistence'
import { testReducer } from 'src/util/testHelpers'

let chatIsChatting = require('../chat-is-chatting').default

describe('chatDefaultDepartment initialState', () => {
  it('sets the state to false when there is nothing in local storage', () => {
    expect(chatIsChatting(undefined, { type: '' })).toEqual(false)
  })

  it('sets the state to the value in local storage if it exists', () => {
    store.set('store', { is_chatting: true })
    jest.resetModules()

    chatIsChatting = require('../chat-is-chatting').default
    // rerequire simulates page refresh
    expect(chatIsChatting(undefined, { type: '' })).toEqual(true)

    store.clear()
  })
})

testReducer(chatIsChatting, [
  {
    action: {
      type: actions.IS_CHATTING,
      payload: true
    },
    initialState: false,
    expected: true
  },
  {
    action: {
      type: actions.SDK_CONNECTION_UPDATE,
      payload: { type: 'connection_update', detail: 'closed' }
    },
    initialState: true,
    expected: false,
    extraDesc: 'sets to false on connection close'
  },
  {
    action: {
      type: actions.SDK_CONNECTION_UPDATE,
      payload: { type: 'connection_update', detail: 'open' }
    },
    extraDesc: 'does not set to false if not connection close',
    initialState: true,
    expected: true
  },
  {
    action: {
      type: actions.CHAT_MSG_REQUEST_SUCCESS
    },
    initialState: false,
    expected: true
  },
  {
    action: {
      type: actions.END_CHAT_REQUEST_SUCCESS
    },
    initialState: true,
    expected: false
  },
  {
    action: {
      type: actions.CHAT_BANNED
    },
    initialState: true,
    expected: false
  },
  {
    action: {
      type: actions.UPDATE_PREVIEWER_SCREEN,
      payload: {
        status: false
      }
    },
    initialState: true,
    expected: false
  }
])
