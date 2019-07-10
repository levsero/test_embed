import reducer from '../preview-enabled'
import { PREVIEWER_LOADED } from 'src/redux/modules/chat/chat-action-types'

const initialState = () => {
  return reducer(undefined, { type: '' })
}

const reduce = () => {
  return reducer(initialState(), { type: PREVIEWER_LOADED })
}

test('initialState', () => {
  expect(initialState()).toEqual(false)
})

describe('when PREVIEWER_LOADED action is dispatched', () => {
  it('enables the previewer', () => {
    expect(reduce()).toEqual(true)
  })
})
