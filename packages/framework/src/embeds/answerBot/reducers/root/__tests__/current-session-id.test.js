import reducer from '../current-session-id'
import * as actionTypes from 'src/embeds/answerBot/actions/sessions/action-types'

test('initial state is null', () => {
  expect(reducer(undefined, { type: '' })).toBeNull()
})

test('updates to expected state', () => {
  const state = reducer(undefined, {
    type: actionTypes.SESSION_STARTED,
    payload: { sessionID: 'blah' },
  })

  expect(state).toMatchInlineSnapshot(`"blah"`)
})
