import * as actionTypes from 'classicSrc/embeds/answerBot/actions/root/action-types'
import reducer from '../current-screen'

test('initial state is null', () => {
  expect(reducer(undefined, { type: '' })).toEqual('conversation')
})

test('updates to expected state', () => {
  const state = reducer(undefined, {
    type: actionTypes.SCREEN_CHANGED,
    payload: 'blahblah',
  })

  expect(state).toMatchInlineSnapshot(`"blahblah"`)
})
