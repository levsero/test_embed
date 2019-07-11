import reducer from '../messages'
import * as actionTypes from '../../action-types'
import * as rootActionTypes from 'src/redux/modules/answerBot/root/action-types'

const matchesSnapshot = state => {
  expect(Array.from(state.values())).toMatchSnapshot()
}

test('initial state is empty map', () => {
  expect(reducer(undefined, { type: '' }).size).toEqual(0)
})

test('QUESTION_VALUE_SUBMITTED updates to expected state', () => {
  const payload = {
    timestamp: 123456,
    message: 'Surely not EVERYONE was kung fu fighting.'
  }

  const state = reducer(undefined, {
    type: actionTypes.QUESTION_VALUE_SUBMITTED,
    payload
  })

  matchesSnapshot(state)
})

test('QUESTION_SUBMITTED_FULFILLED updates to expected state', () => {
  const payload = {
    timestamp: 123456,
    message: [
      { id: 1, title: 'article1' },
      { id: 2, title: 'article2' },
      { id: 3, title: 'article3' }
    ]
  }

  const state = reducer(undefined, {
    type: actionTypes.QUESTION_SUBMITTED_FULFILLED,
    payload
  })

  matchesSnapshot(state)
})

test('BOT_FEEDBACK_REQUESTED updates to expected state', () => {
  const state = reducer(undefined, {
    type: rootActionTypes.BOT_FEEDBACK_REQUESTED
  })

  matchesSnapshot(state)
})

test('BOT_FEEDBACK updates to expected state', () => {
  const payload = {
    timestamp: 123456
  }

  const state = reducer(undefined, {
    type: rootActionTypes.BOT_FEEDBACK,
    payload
  })

  matchesSnapshot(state)
})

test('BOT_CHANNEL_CHOICE updates to expected state', () => {
  const state = reducer(undefined, {
    type: rootActionTypes.BOT_CHANNEL_CHOICE
  })

  matchesSnapshot(state)
})

test('BOT_TYPING updates to expected state', () => {
  const state = reducer(undefined, {
    type: rootActionTypes.BOT_TYPING,
    payload: {
      timestamp: 123456
    }
  })

  matchesSnapshot(state)
})
