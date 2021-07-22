import configureMockStore from 'redux-mock-store'
import thunk from 'redux-thunk'
import { store } from 'src/framework/services/persistence'
import { UPDATE_ACTIVE_EMBED } from 'src/redux/modules/base/base-action-types'
import {
  IS_CHATTING,
  CHAT_WINDOW_OPEN_ON_NAVIGATE,
  CHAT_DROPPED,
} from 'src/redux/modules/chat/chat-action-types'

let getIsChatting = require('../getIsChatting').getIsChatting
let isMobileBrowser = require('utility/devices').isMobileBrowser

const resetMocks = () => {
  jest.resetModules()

  getIsChatting = require('../getIsChatting').getIsChatting
  isMobileBrowser = require('utility/devices').isMobileBrowser

  jest.mock('utility/devices')
  isMobileBrowser.mockReturnValue(false)
}
const callAction = (isChatting = true) => {
  const mockStore = configureMockStore([thunk])
  const isChattingSpy = jest.fn().mockImplementation(() => isChatting)
  const mockZChatState = {
    chat: {
      vendor: {
        zChat: {
          isChatting: isChattingSpy,
        },
      },
    },
  }
  const reduxStore = mockStore(mockZChatState)

  reduxStore.clearActions()

  reduxStore.dispatch(getIsChatting())

  return reduxStore
}

describe('getIsChatting', () => {
  test('dispatches the value from zChat', () => {
    const reduxStore = callAction()

    expect(reduxStore.getActions()[0]).toEqual({ type: IS_CHATTING, payload: true })
  })

  describe('when isChatting is true', () => {
    test('dispatches updateActiveEmbed with the value in the stored activeEmbed', () => {
      store.set('store', { activeEmbed: 'helpCenter' })
      resetMocks()

      const reduxStore = callAction()

      expect(reduxStore.getActions()[1]).toEqual({
        type: UPDATE_ACTIVE_EMBED,
        payload: 'helpCenter',
      })
    })

    test('dispatches chatWindowOpenOnNavigate when the stored value widgetShown is true', () => {
      store.set('store', { widgetShown: true })
      resetMocks()

      const reduxStore = callAction()

      expect(reduxStore.getActions()[1]).toEqual({
        type: CHAT_WINDOW_OPEN_ON_NAVIGATE,
      })
    })

    test('does not dispatch chatWindowOpenOnNavigate when the stored value widgetShown is false', () => {
      store.set('store', { widgetShown: false })
      resetMocks()

      const reduxStore = callAction()

      expect(reduxStore.getActions()[1]).not.toEqual({
        type: CHAT_WINDOW_OPEN_ON_NAVIGATE,
      })
    })

    test('does not dispatch chatWindowOpenOnNavigate when isMobileBrowser is true', () => {
      store.set('store', { widgetShown: true })
      resetMocks()
      isMobileBrowser.mockReturnValue(true)

      const reduxStore = callAction()

      expect(reduxStore.getActions()[1]).not.toEqual({
        type: CHAT_WINDOW_OPEN_ON_NAVIGATE,
      })
    })
  })

  describe('when isChatting is false', () => {
    test('dispatches chatDropped if is_chatting is true in localStorage', () => {
      store.set('store', { is_chatting: true })

      const reduxStore = callAction(false)

      expect(reduxStore.getActions()[1]).toEqual({
        type: CHAT_DROPPED,
      })
    })

    test('does not dispatch chatDropped if is_chatting is false in localStorage', () => {
      store.set('store', { is_chatting: false })

      const reduxStore = callAction(false)

      expect(reduxStore.getActions()[1]).toBeUndefined()
    })
  })
})
