import * as actionTypes from 'src/embeds/answerBot/actions/root/action-types'
import reducer from '../greeted'

test('initial state is null', () => {
  expect(reducer(undefined, { type: '' })).toEqual(false)
})

test('updates to expected state', () => {
  const state = reducer(undefined, {
    type: actionTypes.BOT_GREETED,
    payload: true,
  })

  expect(state).toMatchInlineSnapshot(`true`)
})
