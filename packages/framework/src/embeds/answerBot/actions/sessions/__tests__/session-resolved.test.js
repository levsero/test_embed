import configureMockStore from 'redux-mock-store'
import thunk from 'redux-thunk'
import * as actions from '../session-resolved'
import { http } from 'service/transport'
import { settings } from 'service/settings'

jest.mock('service/transport')

const mockStore = configureMockStore([thunk])

settings.init()

describe('sessionResolved', () => {
  let dispatchedActions, store

  beforeEach(() => {
    const state = {
      answerBot: {
        currentSessionID: 1234,
        currentArticle: {
          articleID: 4567,
        },
        sessions: new Map([
          [
            1234,
            {
              deflection: { id: 888 },
              interactionToken: { y: 2 },
            },
          ],
        ]),
      },
    }

    store = mockStore(state)

    store.dispatch(actions.sessionResolved())

    dispatchedActions = store.getActions()
  })

  it('dispatches the expected pending actions', () => {
    expect(dispatchedActions).toMatchInlineSnapshot(`
      Array [
        Object {
          "payload": Object {
            "articleID": 4567,
            "sessionID": 1234,
          },
          "type": "widget/answerBot/SESSION_RESOLVED_PENDING",
        },
      ]
    `)
  })

  it('sends the expected http params', () => {
    expect(http.send).toMatchInlineSnapshot(`
      [MockFunction] {
        "calls": Array [
          Array [
            Object {
              "callbacks": Object {
                "done": [Function],
                "fail": [Function],
              },
              "method": "post",
              "params": Object {
                "article_id": 4567,
                "deflection_id": 888,
                "interaction_access_token": Object {
                  "y": 2,
                },
                "resolution_channel_id": 67,
              },
              "path": "/api/v2/answer_bot/resolution",
            },
          ],
        ],
        "results": Array [
          Object {
            "type": "return",
            "value": undefined,
          },
        ],
      }
    `)
  })

  describe('callbacks', () => {
    it('dispatches expected actions on successful request', () => {
      const callback = http.send.mock.calls[0][0].callbacks.done

      callback()
      expect(store.getActions()).toMatchInlineSnapshot(`
        Array [
          Object {
            "payload": Object {
              "articleID": 4567,
              "sessionID": 1234,
            },
            "type": "widget/answerBot/SESSION_RESOLVED_PENDING",
          },
          Object {
            "payload": Object {
              "articleID": 4567,
              "sessionID": 1234,
            },
            "type": "widget/answerBot/SESSION_RESOLVED_FULFILLED",
          },
        ]
      `)
    })

    it('dispatches expected actions on failed request', () => {
      const callback = http.send.mock.calls[0][0].callbacks.fail

      callback({ error: 'blah' })
      expect(store.getActions()).toMatchInlineSnapshot(`
        Array [
          Object {
            "payload": Object {
              "articleID": 4567,
              "sessionID": 1234,
            },
            "type": "widget/answerBot/SESSION_RESOLVED_PENDING",
          },
          Object {
            "payload": Object {
              "articleID": 4567,
              "error": Object {
                "error": "blah",
              },
              "sessionID": 1234,
            },
            "type": "widget/answerBot/SESSION_RESOLVED_REJECTED",
          },
        ]
      `)
    })
  })
})
