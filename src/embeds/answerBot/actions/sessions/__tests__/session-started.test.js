import * as actions from '../session-started'

test('sessionStarted generates the expected payload', () => {
  jest.spyOn(Date, 'now').mockReturnValue(22222)
  expect(actions.sessionStarted()).toMatchInlineSnapshot(`
    Object {
      "payload": Object {
        "sessionData": Object {
          "articles": Array [],
          "fallbackSuggested": false,
          "requestStatus": null,
          "resolved": false,
        },
        "sessionID": 22222,
      },
      "type": "widget/answerBot/SESSION_STARTED",
    }
  `)
})
