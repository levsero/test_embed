import * as actionTypes from 'src/embeds/answerBot/actions/conversation/action-types'
import * as rootActionTypes from 'src/embeds/answerBot/actions/root/action-types'
import reducer from '../messages'

test('initial state is empty map', () => {
  expect(reducer(undefined, { type: '' }).size).toEqual(0)
})

test('QUESTION_VALUE_SUBMITTED updates to expected state', () => {
  const payload = {
    timestamp: 123456,
    message: 'Surely not EVERYONE was kung fu fighting.',
  }

  const state = reducer(undefined, {
    type: actionTypes.QUESTION_VALUE_SUBMITTED,
    payload,
  })

  expect(Array.from(state.values())).toMatchInlineSnapshot(`
    Array [
      Object {
        "isVisitor": true,
        "message": "Surely not EVERYONE was kung fu fighting.",
        "timestamp": 123456,
      },
    ]
  `)
})

test('QUESTION_SUBMITTED_FULFILLED updates to expected state', () => {
  const payload = {
    timestamp: 123456,
    message: [
      { id: 1, title: 'article1' },
      { id: 2, title: 'article2' },
      { id: 3, title: 'article3' },
    ],
  }

  const state = reducer(undefined, {
    type: actionTypes.QUESTION_SUBMITTED_FULFILLED,
    payload,
  })

  expect(Array.from(state.values())).toMatchInlineSnapshot(`
    Array [
      Object {
        "timestamp": 123456,
        "type": "results",
      },
    ]
  `)
})

test('BOT_FEEDBACK_REQUESTED updates to expected state', () => {
  const state = reducer(undefined, {
    type: rootActionTypes.BOT_FEEDBACK_REQUESTED,
  })

  expect(Array.from(state.values())).toMatchInlineSnapshot(`
    Array [
      Object {
        "type": "feedbackRequested",
      },
    ]
  `)
})

test('BOT_FEEDBACK updates to expected state', () => {
  const payload = {
    timestamp: 123456,
  }

  const state = reducer(undefined, {
    type: rootActionTypes.BOT_FEEDBACK,
    payload,
  })

  expect(Array.from(state.values())).toMatchInlineSnapshot(`
    Array [
      Object {
        "isVisitor": true,
        "timestamp": 123456,
        "type": "feedback",
      },
    ]
  `)
})

test('BOT_CHANNEL_CHOICE updates to expected state', () => {
  const state = reducer(undefined, {
    type: rootActionTypes.BOT_CHANNEL_CHOICE,
  })

  expect(Array.from(state.values())).toMatchInlineSnapshot(`
    Array [
      Object {
        "type": "channelChoice",
      },
    ]
  `)
})

test('BOT_TYPING updates to expected state', () => {
  const state = reducer(undefined, {
    type: rootActionTypes.BOT_TYPING,
    payload: {
      timestamp: 123456,
    },
  })

  expect(Array.from(state.values())).toMatchInlineSnapshot(`
    Array [
      Object {
        "timestamp": 123456,
        "type": "botTyping",
      },
    ]
  `)
})
