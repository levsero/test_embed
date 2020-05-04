import configureMockStore from 'redux-mock-store'
import thunk from 'redux-thunk'
import * as actions from '../session-fallback-suggested'

const mockStore = configureMockStore([thunk])

it('sessionFallbackSuggested dispatches the expected actions', () => {
  const state = {
    answerBot: {
      currentSessionID: 1234,
      sessions: new Map([[1234, {}]])
    }
  }

  const store = mockStore(state)

  store.dispatch(actions.sessionFallback())

  expect(store.getActions()).toMatchInlineSnapshot(`
    Array [
      Object {
        "payload": Object {
          "sessionID": 1234,
        },
        "type": "widget/answerBot/SESSION_FALLBACK",
      },
    ]
  `)
})
