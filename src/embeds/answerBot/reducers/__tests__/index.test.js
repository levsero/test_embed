import reducer from 'src/embeds/answerBot/reducers'

describe('answerBot root reducer', () => {
  it('has the expected sub states', () => {
    const state = reducer({}, { type: '' })

    expect(state).toMatchInlineSnapshot(`
      Object {
        "contextualSearchFinished": false,
        "conversation": Object {
          "getInTouchVisible": false,
          "lastScreenClosed": 0,
          "lastScroll": 0,
        },
        "currentArticle": null,
        "currentContextualArticle": null,
        "currentMessage": "",
        "currentScreen": "conversation",
        "currentSessionID": null,
        "greeted": false,
        "initialFallbackSuggested": false,
        "messages": Map {},
        "questionValueChangedTime": null,
        "sessions": Map {},
      }
    `)
  })
})
