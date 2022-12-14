import * as actions from 'classicSrc/redux/modules/chat/chat-action-types'
import reducer from '../chat-show-history'

const initialState = reducer(undefined)

test('initialState is false', () => {
  expect(initialState).toEqual(false)
})

describe('when passed OPENED_CHAT_HISTORY', () => {
  it('returns true', () => {
    const result = reducer('swoop', { type: actions.OPENED_CHAT_HISTORY })

    expect(result).toEqual(true)
  })
})

describe('when passed CLOSED_CHAT_HISTORY', () => {
  it('returns true', () => {
    const result = reducer('swoop', {
      type: actions.CLOSED_CHAT_HISTORY,
    })

    expect(result).toEqual(false)
  })
})
