import reducer from '../last-screen-closed'
import * as actionTypes from '../../action-types'

test('initial state is null', () => {
  expect(reducer(undefined, { type: '' })).toEqual(0)
})

test('updates to expected state', () => {
  const state = reducer(undefined, {
    type: actionTypes.CONVERSATION_SCREEN_CLOSED,
    payload: 77
  })

  expect(state).toMatchSnapshot()
})
