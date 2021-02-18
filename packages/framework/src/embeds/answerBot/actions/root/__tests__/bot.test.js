import configureMockStore from 'redux-mock-store'
import thunk from 'redux-thunk'
import * as actions from '../bot'
import * as selectors from 'src/redux/modules/selectors/selectors'

const mockStore = configureMockStore([thunk])

beforeEach(() => {
  jest.spyOn(Date, 'now').mockReturnValue(1531267200000)
})

const createStore = () => {
  const state = {
    answerBot: {
      currentSessionID: 1234,
    },
  }

  return mockStore(state)
}

describe('botMessage', () => {
  it('dispatches expected actions', () => {
    const store = createStore()

    store.dispatch(actions.botMessage('hello world'))

    expect(store.getActions()).toMatchInlineSnapshot(`
      Array [
        Object {
          "payload": Object {
            "message": Object {
              "interpolation": Object {},
              "key": "hello world",
            },
            "sessionID": 1234,
            "timestamp": 1531267200000,
          },
          "type": "widget/answerBot/BOT_MESSAGE",
        },
      ]
    `)
  })
})

describe('botChannelChoice', () => {
  it('dispatches expected payload', () => {
    expect(actions.botChannelChoice('hello', true)).toMatchInlineSnapshot(`
      Object {
        "payload": Object {
          "fallback": false,
          "message": Object {
            "interpolation": true,
            "key": "hello",
          },
          "timestamp": 1531267200000,
        },
        "type": "widget/answerBot/BOT_CHANNEL_CHOICE",
      }
    `)
  })

  it('defaults to false fallback', () => {
    expect(actions.botChannelChoice('world')).toMatchInlineSnapshot(`
      Object {
        "payload": Object {
          "fallback": false,
          "message": Object {
            "interpolation": Object {},
            "key": "world",
          },
          "timestamp": 1531267200000,
        },
        "type": "widget/answerBot/BOT_CHANNEL_CHOICE",
      }
    `)
  })
})

describe('botFeedback', () => {
  it('dispatches expected payload', () => {
    expect(actions.botFeedback('secondary')).toMatchInlineSnapshot(`
      Object {
        "payload": Object {
          "feedbackType": "secondary",
          "timestamp": 1531267200000,
        },
        "type": "widget/answerBot/BOT_FEEDBACK",
      }
    `)
  })

  it('defaults to primary', () => {
    expect(actions.botFeedback()).toMatchInlineSnapshot(`
      Object {
        "payload": Object {
          "feedbackType": "primary",
          "timestamp": 1531267200000,
        },
        "type": "widget/answerBot/BOT_FEEDBACK",
      }
    `)
  })
})

describe('botFeedbackRequested', () => {
  it('dispatches expected payload', () => {
    expect(actions.botFeedbackRequested()).toMatchInlineSnapshot(`
      Object {
        "type": "widget/answerBot/BOT_FEEDBACK_REQUESTED",
      }
    `)
  })
})

test('botGreeted dispatches expected payload', () => {
  expect(actions.botGreeted()).toMatchInlineSnapshot(`
    Object {
      "payload": true,
      "type": "widget/answerBot/BOT_GREETED",
    }
  `)
})

test('botInitialFallback dispatches expected payload', () => {
  expect(actions.botInitialFallback()).toMatchInlineSnapshot(`
    Object {
      "payload": true,
      "type": "widget/answerBot/BOT_INITIAL_FALLBACK",
    }
  `)
})

test('botUserMessage dispatches expected payload', () => {
  expect(actions.botUserMessage('hello')).toMatchInlineSnapshot(`
    Object {
      "payload": Object {
        "feedbackRelated": true,
        "isVisitor": true,
        "message": Object {
          "interpolation": Object {},
          "key": "hello",
        },
        "timestamp": 1531267200000,
      },
      "type": "widget/answerBot/BOT_MESSAGE",
    }
  `)
})

test('botTyping dispatches expected payload', () => {
  expect(actions.botTyping()).toMatchInlineSnapshot(`
    Object {
      "payload": Object {
        "timestamp": 1531267200000,
      },
      "type": "widget/answerBot/BOT_TYPING",
    }
  `)
})

describe('botFeedbackMessage', () => {
  it('dispatches expected payload', () => {
    expect(actions.botFeedbackMessage('hello')).toMatchInlineSnapshot(`
      Object {
        "payload": Object {
          "feedbackRelated": true,
          "message": Object {
            "interpolation": Object {},
            "key": "hello",
          },
          "timestamp": 1531267200000,
        },
        "type": "widget/answerBot/BOT_MESSAGE",
      }
    `)
  })
})

describe('botFallbackMessage', () => {
  describe('when feedbackRelated is not passed in', () => {
    const doAction = (channelAvailable) => {
      const store = createStore()
      jest.spyOn(selectors, 'getChannelAvailable').mockReturnValue(channelAvailable)
      store.dispatch(actions.botFallbackMessage())
      return store
    }

    it('dispatches the appropriate actions when channelAvailable is true', () => {
      const store = doAction(true)
      expect(store.getActions()).toMatchInlineSnapshot(`
        Array [
          Object {
            "payload": Object {
              "message": Object {
                "interpolation": Object {},
                "key": "embeddable_framework.answerBot.msg.prompt_again_no_channels_available",
              },
              "sessionID": 1234,
              "timestamp": 1531267200000,
            },
            "type": "widget/answerBot/BOT_MESSAGE",
          },
          Object {
            "payload": Object {
              "message": Object {
                "interpolation": Object {},
                "key": "embeddable_framework.answerBot.msg.initial_fallback",
              },
              "sessionID": 1234,
              "timestamp": 1531267200000,
            },
            "type": "widget/answerBot/BOT_MESSAGE",
          },
          Object {
            "type": "widget/answerBot/GET_IN_TOUCH_SHOWN",
          },
        ]
      `)
    })

    it('dispatches the appropriate actions when channelAvailable is false', () => {
      const store = doAction(false)
      expect(store.getActions()).toMatchInlineSnapshot(`
        Array [
          Object {
            "payload": Object {
              "message": Object {
                "interpolation": Object {},
                "key": "embeddable_framework.answerBot.msg.prompt_again_after_yes",
              },
              "sessionID": 1234,
              "timestamp": 1531267200000,
            },
            "type": "widget/answerBot/BOT_MESSAGE",
          },
          Object {
            "type": "widget/answerBot/GET_IN_TOUCH_SHOWN",
          },
        ]
      `)
    })
  })

  describe('when feedbackRelated is true', () => {
    it('adds `feedbackRelated: true` to the botMessage payload', () => {
      const store = createStore()

      jest.spyOn(selectors, 'getChannelAvailable').mockReturnValue(false)
      store.dispatch(actions.botFallbackMessage(true))
      const payload = store.getActions()[0].payload

      expect(payload.feedbackRelated).toEqual(true)
    })
  })
})
