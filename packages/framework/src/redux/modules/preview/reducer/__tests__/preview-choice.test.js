import { CHAT, CHAT_BADGE } from 'src/constants/preview'
import { PREVIEW_CHOICE_SELECTED } from 'src/redux/modules/preview/preview-action-types'
import reducer from '../preview-choice'

const initialState = () => {
  return reducer(undefined, { type: '' })
}

const reduce = (payload) => {
  return reducer(initialState(), {
    type: PREVIEW_CHOICE_SELECTED,
    payload,
  })
}

test('initial state', () => {
  expect(initialState()).toEqual(CHAT)
})

describe('when PREVIEW_CHOICE_SELECTED is dispatched', () => {
  it('updates the preview choice', () => {
    expect(reduce(CHAT_BADGE)).toEqual(CHAT_BADGE)
  })
})
