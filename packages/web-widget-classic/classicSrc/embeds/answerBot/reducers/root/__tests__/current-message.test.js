import * as actionTypes from 'classicSrc/embeds/answerBot/actions/conversation/action-types'
import reducer from '../current-message'

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
