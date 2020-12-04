import reducer from '../sessions'
import * as actionTypes from 'src/embeds/answerBot/actions/sessions/action-types'
import * as conversationActionTypes from 'src/embeds/answerBot/actions/conversation/action-types'
import * as articleActionTypes from 'src/embeds/answerBot/actions/article/action-types'

const initialState = reducer(undefined, { type: '' })

describe('initial state', () => {
  it('contains no entries', () => {
    expect(initialState.size).toEqual(0)
  })
})

describe('when SESSION_STARTED is dispatched', () => {
  describe('adds the session', () => {
    let state, payload

    beforeEach(() => {
      payload = {
        sessionID: 123,
        sessionData: { resolved: false }
      }

      state = reducer(initialState, {
        type: actionTypes.SESSION_STARTED,
        payload: payload
      })
    })

    it('adds a single session', () => {
      expect(state.size).toEqual(1)
    })

    it('creates the session with provided value', () => {
      expect(state.get(payload.sessionID)).toEqual(
        expect.objectContaining({
          resolved: false
        })
      )
    })
  })
})

describe('when QUESTION_SUBMITTED_FULFILLED is dispatched', () => {
  it('updates the session with expected values', () => {
    const payload = {
      deflection: 'deflection',
      interaction_access_token: 'token', // eslint-disable-line camelcase
      sessionID: 123,
      message: [
        { article_id: 1, html_body: 'one' }, // eslint-disable-line camelcase
        { article_id: 2, html_body: 'two' }, // eslint-disable-line camelcase
        { article_id: 3, html_body: 'three' } // eslint-disable-line camelcase
      ]
    }

    const currentState = new Map([[123, {}]])

    const state = reducer(currentState, {
      type: conversationActionTypes.QUESTION_SUBMITTED_FULFILLED,
      payload: payload
    })

    expect(state.get(payload.sessionID)).toEqual(
      expect.objectContaining({
        articles: [
          expect.objectContaining({ id: 1, body: 'one' }),
          expect.objectContaining({ id: 2, body: 'two' }),
          expect.objectContaining({ id: 3, body: 'three' })
        ],
        requestStatus: 'COMPLETED',
        deflection: 'deflection',
        interactionToken: 'token'
      })
    )
  })

  describe('normalizing articles', () => {
    it('limits the results to 3', () => {
      const payload = {
        sessionID: 123,
        message: [
          { article_id: 1, html_body: 'one' }, // eslint-disable-line camelcase
          { article_id: 2, html_body: 'two' }, // eslint-disable-line camelcase
          { article_id: 3, html_body: 'three' }, // eslint-disable-line camelcase
          { article_id: 4, html_body: 'four' } // eslint-disable-line camelcase
        ]
      }

      const currentState = new Map([[123, {}]])

      const state = reducer(currentState, {
        type: conversationActionTypes.QUESTION_SUBMITTED_FULFILLED,
        payload: payload
      })

      expect(state.get(payload.sessionID)).toEqual(
        expect.objectContaining({
          articles: [
            expect.objectContaining({ id: 1, body: 'one' }),
            expect.objectContaining({ id: 2, body: 'two' }),
            expect.objectContaining({ id: 3, body: 'three' })
          ]
        })
      )
    })

    it('handles responses that are not arrays', () => {
      const payload = {
        sessionID: 123,
        message: {}
      }

      const currentState = new Map([[123, {}]])

      const state = reducer(currentState, {
        type: conversationActionTypes.QUESTION_SUBMITTED_FULFILLED,
        payload: payload
      })

      expect(state.get(payload.sessionID)).toEqual(
        expect.objectContaining({
          articles: []
        })
      )
    })
  })
})

describe('when QUESTION_SUBMITTED_PENDING is dispatched', () => {
  it('updates the session with expected values', () => {
    const payload = { sessionID: 123, message: 'hello' }

    const currentState = new Map([[123, {}]])

    const state = reducer(currentState, {
      type: conversationActionTypes.QUESTION_SUBMITTED_PENDING,
      payload: payload
    })

    expect(state.get(payload.sessionID)).toEqual(
      expect.objectContaining({
        requestStatus: 'PENDING',
        query: 'hello'
      })
    )
  })
})

describe('when QUESTION_SUBMITTED_REJECTED is dispatched', () => {
  it('updates the session with expected values', () => {
    const payload = { sessionID: 123 }

    const currentState = new Map([[123, {}]])

    const state = reducer(currentState, {
      type: conversationActionTypes.QUESTION_SUBMITTED_REJECTED,
      payload: payload
    })

    expect(state.get(payload.sessionID)).toEqual(
      expect.objectContaining({
        requestStatus: 'REJECTED'
      })
    )
  })
})

describe('when SESSION_RESOLVED_PENDING is dispatched', () => {
  it('updates the session with expected values', () => {
    const payload = { sessionID: 123 }

    const currentState = new Map([[123, {}]])

    const state = reducer(currentState, {
      type: actionTypes.SESSION_RESOLVED_PENDING,
      payload: payload
    })

    expect(state.get(payload.sessionID)).toEqual(
      expect.objectContaining({
        resolved: true
      })
    )
  })
})

describe('when SESSION_FALLBACK is dispatched', () => {
  it('updates the session with expected values', () => {
    const payload = { sessionID: 123 }

    const currentState = new Map([[123, {}]])

    const state = reducer(currentState, {
      type: actionTypes.SESSION_FALLBACK,
      payload: payload
    })

    expect(state.get(payload.sessionID)).toEqual(
      expect.objectContaining({
        fallbackSuggested: true
      })
    )
  })
})

describe('when SESSION_AUTO_SCROLL is dispatched', () => {
  beforeEach(() => {
    jest.spyOn(Date, 'now').mockReturnValue(1234)
  })

  afterEach(() => {
    Date.now.mockRestore()
  })

  it('updates the session with expected values', () => {
    const payload = { sessionID: 123 }

    const currentState = new Map([[123, {}]])

    const state = reducer(currentState, {
      type: actionTypes.SESSION_AUTO_SCROLL,
      payload: payload
    })

    expect(state.get(payload.sessionID)).toEqual(
      expect.objectContaining({
        autoScrolled: 1234
      })
    )
  })
})

describe('when ARTICLE_DISMISSED is dispatched', () => {
  it('updates the session articles with expected values', () => {
    const payload = { articleID: 456, sessionID: 123 }
    const articles = [{ id: 789 }, { id: 456 }]

    const currentState = new Map([[123, { articles }]])

    const state = reducer(currentState, {
      type: articleActionTypes.ARTICLE_DISMISSED_PENDING,
      payload: payload
    })

    expect(state.get(payload.sessionID).articles).toContainEqual({
      id: 456,
      markedAsIrrelevant: true
    })
  })
})
