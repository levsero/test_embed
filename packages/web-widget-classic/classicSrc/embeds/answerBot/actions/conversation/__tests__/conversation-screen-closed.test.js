import * as actions from '../conversation-screen-closed'

test('conversationScreenClosed dispatches expected payload', () => {
  jest.spyOn(Date, 'now').mockReturnValue(32)
  expect(actions.conversationScreenClosed()).toMatchInlineSnapshot(`
    Object {
      "payload": 32,
      "type": "widget/answerBot/CONVERSATION_SCREEN_CLOSED",
    }
  `)
})
