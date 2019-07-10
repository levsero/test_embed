import reducer from '../zopimChat-isOpen'
import * as zopimChatActions from 'src/redux/modules/zopimChat/zopimChat-action-types'
import * as chatActionTypes from 'src/redux/modules/chat/chat-action-types'

const mockState = { beep: 'Hello Fren' }
const initialState = reducer(undefined, { type: '' })

test('initialState is false', () => {
  expect(initialState).toEqual(false)
})

test('unknown type is passed', () => {
  expect(
    reducer(mockState, {
      type: ''
    })
  ).toEqual(mockState)
})

test('ZOPIM_ON_OPEN is dispatched', () => {
  expect(
    reducer(mockState, {
      type: zopimChatActions.ZOPIM_ON_OPEN
    })
  ).toEqual(true)
})

test('ZOPIM_ON_CLOSE is dispatched', () => {
  expect(
    reducer(mockState, {
      type: zopimChatActions.ZOPIM_ON_CLOSE
    })
  ).toEqual(false)
})

test('CHAT_BANNED is dispatched', () => {
  expect(
    reducer(mockState, {
      type: chatActionTypes.CHAT_BANNED
    })
  ).toEqual(initialState)
})
