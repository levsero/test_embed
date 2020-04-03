import reducer from '../last-scroll'
import * as actionTypes from 'src/embeds/answerBot/actions/conversation/action-types'

test('initial state is null', () => {
  expect(reducer(undefined, { type: '' })).toEqual(0)
})

test('updates to expected state', () => {
  const state = reducer(undefined, {
    type: actionTypes.CONVERSATION_SCROLL_CHANGED,
    payload: 88
  })

  expect(state).toMatchSnapshot()
})
