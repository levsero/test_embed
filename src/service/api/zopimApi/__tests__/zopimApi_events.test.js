import { wait } from '@testing-library/react'
import zopimApi from '..'

import createStore from 'src/redux/createStore'
import * as chatActionTypes from 'src/redux/modules/chat/chat-action-types'
import * as callbacks from 'service/api/callbacks'
import {
  CHAT_ENDED_EVENT,
  CHAT_STARTED_EVENT,
  CHAT_CONNECTED_EVENT,
  CHAT_UNREAD_MESSAGES_EVENT,
  CHAT_DEPARTMENT_STATUS_EVENT,
  CHAT_STATUS_EVENT
} from 'constants/event'
import { CHAT_CONNECTED } from 'src/redux/modules/chat/chat-action-types'

const setup = () => {
  const mockWin = {}
  const callback = jest.fn(() => 123)
  const store = createStore()

  store.dispatch({ type: CHAT_CONNECTED })

  zopimApi.setUpZopimApiMethods(mockWin, store)

  return {
    mockWin,
    store,
    callback
  }
}

describe('zopim events', () => {
  test('onShow fire widget open event', async () => {
    const { callback, mockWin } = setup()

    expect(callback).not.toHaveBeenCalled()
    mockWin.$zopim.livechat.window.onHide(callback)
    await (() => {
      expect(callback).toHaveBeenCalled()
    })
  })

  test('onHide fire widget close event', async () => {
    const { callback, mockWin } = setup()

    expect(callback).not.toHaveBeenCalled()
    mockWin.$zopim.livechat.window.onHide(callback)
    await (() => {
      expect(callback).toHaveBeenCalled()
    })
  })

  test('setOnConnected callback', () => {
    const { callback, mockWin } = setup()

    mockWin.$zopim.livechat.setOnConnected(callback)

    callbacks.fireFor(CHAT_CONNECTED_EVENT)

    expect(callback).toHaveBeenCalled()
  })

  test('setOnChatStart callback', () => {
    const { callback, mockWin } = setup()

    mockWin.$zopim.livechat.setOnChatStart(callback)

    callbacks.fireFor(CHAT_STARTED_EVENT)

    expect(callback).toHaveBeenCalled()
  })

  test('setOnChatEnd callback', () => {
    const { callback, mockWin } = setup()

    mockWin.$zopim.livechat.setOnChatEnd(callback)

    callbacks.fireFor(CHAT_ENDED_EVENT)

    expect(callback).toHaveBeenCalled()
  })

  test('setOnUnreadMsgs callback', async () => {
    const { callback, mockWin, store } = setup()

    mockWin.$zopim.livechat.setOnUnreadMsgs(callback)
    expect(callback).not.toHaveBeenCalled()

    store.dispatch({
      type: chatActionTypes.NEW_AGENT_MESSAGE_RECEIVED,
      payload: {
        proactive: true,
        nick: 'black hole',
        display_name: 'black hole', // eslint-disable-line camelcase
        msg: 'check it'
      }
    })
    callbacks.fireFor(CHAT_UNREAD_MESSAGES_EVENT)

    await wait(() => {
      expect(callback).toHaveBeenCalledWith(1)
    })
  })

  describe('setOnStatus', () => {
    it('dispatches the SDK_ACCOUNT_STATUS and SDK_DEPARTMENT_UPDATE actions', async () => {
      const { callback, mockWin, store } = setup()

      store.dispatch({
        type: chatActionTypes.SDK_ACCOUNT_STATUS,
        payload: { detail: 'yeetStat' }
      })

      mockWin.$zopim.livechat.setOnStatus(callback)
      expect(callback).toHaveBeenCalled()

      callbacks.fireFor(CHAT_STATUS_EVENT)
      callbacks.fireFor(CHAT_DEPARTMENT_STATUS_EVENT, ['someActionPayloadData'])

      await wait(() => {
        expect(callback).toHaveBeenCalledWith('yeetStat')
        expect(callback).toHaveBeenCalledWith('someActionPayloadData')
        expect(callback).toHaveBeenCalledTimes(3)
      })
    })
  })
})
