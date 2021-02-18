import reducer from '../current-message'
import * as actionTypes from 'src/embeds/answerBot/actions/conversation/action-types'

test('initial state is null', () => {
  expect(reducer(undefined, { type: '' })).toEqual('')
})

test('updates to expected state', () => {
  const state = reducer(undefined, {
    type: actionTypes.QUESTION_VALUE_CHANGED,
    payload: 'blahblah',
  })

  expect(state).toMatchInlineSnapshot(`"blahblah"`)
})
