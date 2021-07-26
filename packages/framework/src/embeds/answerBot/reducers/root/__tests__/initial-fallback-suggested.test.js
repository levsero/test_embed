import * as actionTypes from 'src/embeds/answerBot/actions/root/action-types'
import reducer from '../initial-fallback-suggested'

test('initial state is null', () => {
  expect(reducer(undefined, { type: '' })).toEqual(false)
})

test('updates to expected state', () => {
  const state = reducer(undefined, {
    type: actionTypes.BOT_INITIAL_FALLBACK,
    payload: true,
  })

  expect(state).toMatchInlineSnapshot(`true`)
})
