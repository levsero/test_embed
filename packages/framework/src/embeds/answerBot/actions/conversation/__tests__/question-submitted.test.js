import configureMockStore from 'redux-mock-store'
import thunk from 'redux-thunk'
import * as actions from '../question-submitted'
import { http } from 'service/transport'
import { settings } from 'service/settings'
import { identity } from 'service/identity'
import { store } from 'src/framework/services/persistence'
import { i18n } from 'src/apps/webWidget/services/i18n'
import _ from 'lodash'

jest.mock('service/transport')
jest.mock('service/identity')
jest.mock('src/apps/webWidget/services/i18n')

jest.useFakeTimers()

const mockStore = configureMockStore([thunk])

settings.init()
store.set('zE_oauth', {
  token: 'abc123'
})
jest.spyOn(i18n, 'getLocale').mockReturnValue('tl')

Date.now = jest.fn(() => 123456789)
identity.getSuid = jest.fn(() => ({ id: 8888 }))

beforeEach(() => {
  jest.clearAllTimers()
  actions.resetSubmittingMessagesState()
})

describe('questionSubmitted', () => {
  const defaultState = {
    answerBot: {
      currentSessionID: 1234,
      sessions: new Map([
        [
          1234,
          {
            deflection: { id: 888 },
            interactionToken: { y: 2 }
          }
        ]
      ]),
      questionValueChangedTime: 123436789
    },
    settings: {
      answerBot: {
        search: {
          labels: ['this', 'is', 'a', 'label']
        }
      }
    }
  }
  const dispatchAction = (newState = {}) => {
    const state = _.merge({}, defaultState, newState)
    const store = mockStore(state)

    store.dispatch(actions.questionSubmitted('hello world'))

    return store
  }

  it('dispatches the expected pending actions', () => {
    const store = dispatchAction()

    jest.runAllTimers()

    expect(store.getActions()).toMatchInlineSnapshot(`
      Array [
        Object {
          "payload": Object {
            "message": "hello world",
            "sessionID": undefined,
            "timestamp": 123456789,
          },
          "type": "widget/answerBot/QUESTION_VALUE_SUBMITTED",
        },
        Object {
          "payload": Object {
            "timestamp": 123456789,
          },
          "type": "widget/answerBot/BOT_TYPING",
        },
        Object {
          "payload": Object {
            "sessionData": Object {
              "articles": Array [],
              "fallbackSuggested": false,
              "requestStatus": null,
              "resolved": false,
            },
            "sessionID": 123456789,
          },
          "type": "widget/answerBot/SESSION_STARTED",
        },
        Object {
          "payload": Object {
            "message": "hello world",
            "sessionID": 1234,
            "timestamp": 123456789,
          },
          "type": "widget/answerBot/QUESTION_SUBMITTED_PENDING",
        },
      ]
    `)
  })

  it('dispatches the expected action without session starting', () => {
    const store = dispatchAction({
      answerBot: {
        currentSessionID: 4567
      }
    })

    jest.runAllTimers()

    expect(store.getActions()).toMatchInlineSnapshot(`
      Array [
        Object {
          "payload": Object {
            "message": "hello world",
            "sessionID": undefined,
            "timestamp": 123456789,
          },
          "type": "widget/answerBot/QUESTION_VALUE_SUBMITTED",
        },
        Object {
          "payload": Object {
            "timestamp": 123456789,
          },
          "type": "widget/answerBot/BOT_TYPING",
        },
        Object {
          "payload": Object {
            "message": "hello world",
            "sessionID": 4567,
            "timestamp": 123456789,
          },
          "type": "widget/answerBot/QUESTION_SUBMITTED_PENDING",
        },
      ]
    `)
  })

  it('sends the expected http params', () => {
    dispatchAction()
    jest.runAllTimers()
    expect(http.send).toMatchInlineSnapshot(`
      [MockFunction] {
        "calls": Array [
          Array [
            Object {
              "authorization": "Bearer abc123",
              "callbacks": Object {
                "done": [Function],
                "fail": [Function],
              },
              "method": "post",
              "params": Object {
                "deflection_channel_id": 67,
                "enquiry": "hello world",
                "interaction_reference": 8888,
                "interaction_reference_type": 1,
                "labels": Array [
                  "this",
                  "is",
                  "a",
                  "label",
                ],
                "locale": "tl",
                "via_id": 67,
              },
              "path": "/api/v2/answer_bot/interaction?include=html_body",
              "timeout": 10000,
              "useHostMappingIfAvailable": false,
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
      const store = dispatchAction()

      jest.runAllTimers()

      const callback = http.send.mock.calls[0][0].callbacks.done

      callback({
        body: {
          deflection_articles: [1, 2, 3], // eslint-disable-line camelcase
          deflection: { x: 123 },
          interaction_access_token: { y: 456 } // eslint-disable-line camelcase
        }
      })
      expect(store.getActions()).toMatchInlineSnapshot(`
        Array [
          Object {
            "payload": Object {
              "message": "hello world",
              "sessionID": undefined,
              "timestamp": 123456789,
            },
            "type": "widget/answerBot/QUESTION_VALUE_SUBMITTED",
          },
          Object {
            "payload": Object {
              "timestamp": 123456789,
            },
            "type": "widget/answerBot/BOT_TYPING",
          },
          Object {
            "payload": Object {
              "sessionData": Object {
                "articles": Array [],
                "fallbackSuggested": false,
                "requestStatus": null,
                "resolved": false,
              },
              "sessionID": 123456789,
            },
            "type": "widget/answerBot/SESSION_STARTED",
          },
          Object {
            "payload": Object {
              "message": "hello world",
              "sessionID": 1234,
              "timestamp": 123456789,
            },
            "type": "widget/answerBot/QUESTION_SUBMITTED_PENDING",
          },
          Object {
            "payload": Object {
              "deflection": Object {
                "x": 123,
              },
              "interaction_access_token": Object {
                "y": 456,
              },
              "message": Array [
                1,
                2,
                3,
              ],
              "sessionID": 1234,
              "timestamp": 123456789,
            },
            "type": "widget/answerBot/QUESTION_SUBMITTED_FULFILLED",
          },
        ]
      `)
    })

    it('dispatches another request when there are no results and there is a locale in the request', () => {
      const store = dispatchAction()

      jest.runAllTimers()
      store.clearActions()

      const callback = http.send.mock.calls[0][0].callbacks.done

      callback({
        body: {
          deflection_articles: [], // eslint-disable-line camelcase
          deflection: { x: 123 },
          interaction_access_token: { y: 456 } // eslint-disable-line camelcase
        }
      })
      expect(http.send).toHaveBeenCalledTimes(2)
      expect(http.send.mock.calls[1][0]).toMatchInlineSnapshot(`
        Object {
          "authorization": "Bearer abc123",
          "callbacks": Object {
            "done": [Function],
            "fail": [Function],
          },
          "method": "post",
          "params": Object {
            "deflection_channel_id": 67,
            "enquiry": "hello world",
            "interaction_reference": 8888,
            "interaction_reference_type": 1,
            "labels": Array [
              "this",
              "is",
              "a",
              "label",
            ],
            "locale": null,
            "via_id": 67,
          },
          "path": "/api/v2/answer_bot/interaction?include=html_body",
          "timeout": 10000,
          "useHostMappingIfAvailable": false,
        }
      `)
    })

    it('dispatches only 1 request when there are no results and there is no locale in the request', () => {
      jest.spyOn(i18n, 'getLocale').mockReturnValue(null)
      dispatchAction()
      jest.runAllTimers()
      const callback = http.send.mock.calls[0][0].callbacks.done

      callback({
        body: {
          deflection_articles: [], // eslint-disable-line camelcase
          deflection: { x: 123 },
          interaction_access_token: { y: 456 } // eslint-disable-line camelcase
        }
      })
      expect(http.send).toHaveBeenCalledTimes(1)
    })

    it('dispatches expected actions on failed request', () => {
      const store = dispatchAction()

      jest.runAllTimers()
      store.clearActions()
      const callback = http.send.mock.calls[0][0].callbacks.fail

      callback('error')
      expect(store.getActions()).toMatchInlineSnapshot(`
        Array [
          Object {
            "payload": Object {
              "error": "error",
              "sessionID": 1234,
            },
            "type": "widget/answerBot/QUESTION_SUBMITTED_REJECTED",
          },
        ]
      `)
    })
  })
})
