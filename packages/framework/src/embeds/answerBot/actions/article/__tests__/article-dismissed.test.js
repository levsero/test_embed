import configureMockStore from 'redux-mock-store'
import thunk from 'redux-thunk'
import { settings } from 'service/settings'
import { http } from 'service/transport'
import * as actions from '../article-dismissed'

jest.mock('service/transport')

const mockStore = configureMockStore([thunk])

settings.init()

describe('articleDismissed', () => {
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

    store.dispatch(actions.articleDismissed(7))

    dispatchedActions = store.getActions()
  })

  it('dispatches the expected pending actions', () => {
    expect(dispatchedActions).toMatchInlineSnapshot(`
      Array [
        Object {
          "payload": Object {
            "articleID": 4567,
            "reasonID": 7,
            "sessionID": 1234,
          },
          "type": "widget/answerBot/ARTICLE_DISMISSED_PENDING",
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
                "reason_id": 7,
                "resolution_channel_id": 67,
              },
              "path": "/api/v2/answer_bot/rejection",
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
              "reasonID": 7,
              "sessionID": 1234,
            },
            "type": "widget/answerBot/ARTICLE_DISMISSED_PENDING",
          },
          Object {
            "payload": Object {
              "articleID": 4567,
              "reasonID": 7,
              "sessionID": 1234,
            },
            "type": "widget/answerBot/ARTICLE_DISMISSED_FULFILLED",
          },
        ]
      `)
    })

    it('dispatches expected actions on failed request', () => {
      const callback = http.send.mock.calls[0][0].callbacks.fail

      callback()
      expect(store.getActions()).toMatchInlineSnapshot(`
        Array [
          Object {
            "payload": Object {
              "articleID": 4567,
              "reasonID": 7,
              "sessionID": 1234,
            },
            "type": "widget/answerBot/ARTICLE_DISMISSED_PENDING",
          },
          Object {
            "payload": Object {
              "articleID": 4567,
              "error": undefined,
              "reasonID": 7,
              "sessionID": 1234,
            },
            "type": "widget/answerBot/ARTICLE_DISMISSED_REJECTED",
          },
        ]
      `)
    })
  })
})
