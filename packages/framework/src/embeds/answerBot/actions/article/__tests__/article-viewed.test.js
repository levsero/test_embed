import configureMockStore from 'redux-mock-store'
import thunk from 'redux-thunk'
import { ANSWER_BOT_ORIGINAL_ARTICLE_CLICKED } from 'src/embeds/answerBot/actions/article/action-types'
import { settings } from 'src/service/settings'
import { http } from 'src/service/transport'
import * as actions from '../article-viewed'

jest.mock('src/service/transport')

const mockStore = configureMockStore([thunk])

settings.init()

describe('articleViewed', () => {
  let dispatchedActions, store

  beforeEach(() => {
    const state = {
      answerBot: {
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

    store.dispatch(actions.articleViewed(1234, 99))

    dispatchedActions = store.getActions()
  })

  it('dispatches the expected pending actions', () => {
    expect(dispatchedActions).toMatchInlineSnapshot(`
      Array [
        Object {
          "payload": Object {
            "articleID": 99,
            "sessionID": 1234,
          },
          "type": "widget/answerBot/ARTICLE_VIEWED_PENDING",
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
                "article_id": 99,
                "deflection_id": 888,
                "interaction_access_token": Object {
                  "y": 2,
                },
                "resolution_channel_id": 67,
              },
              "path": "/api/v2/answer_bot/viewed",
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
              "articleID": 99,
              "sessionID": 1234,
            },
            "type": "widget/answerBot/ARTICLE_VIEWED_PENDING",
          },
          Object {
            "payload": Object {
              "articleID": 99,
              "sessionID": 1234,
            },
            "type": "widget/answerBot/ARTICLE_VIEWED_FULFILLED",
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
              "articleID": 99,
              "sessionID": 1234,
            },
            "type": "widget/answerBot/ARTICLE_VIEWED_PENDING",
          },
          Object {
            "payload": Object {
              "articleID": 99,
              "error": undefined,
              "sessionID": 1234,
            },
            "type": "widget/answerBot/ARTICLE_VIEWED_REJECTED",
          },
        ]
      `)
    })
  })
})

describe('originalArticleClicked', () => {
  it('returns an action including the provided article id', () => {
    expect(actions.originalArticleClicked('articleId')).toEqual({
      type: ANSWER_BOT_ORIGINAL_ARTICLE_CLICKED,
      payload: {
        articleId: 'articleId',
      },
    })
  })
})
