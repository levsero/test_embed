import * as actions from '../conversation-scroll-changed'

test('conversationScrollChanged dispatches expected payload', () => {
  expect(actions.conversationScrollChanged(21)).toMatchInlineSnapshot(`
    Object {
      "payload": 21,
      "type": "widget/answerBot/CONVERSATION_SCROLL_CHANGED",
    }
  `)
})
