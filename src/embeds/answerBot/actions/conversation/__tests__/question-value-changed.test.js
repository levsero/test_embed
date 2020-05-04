import * as actions from '../question-value-changed'

test('questionValueChanged dispatches expected payload', () => {
  expect(actions.questionValueChanged('hello')).toMatchInlineSnapshot(`
    Object {
      "payload": "hello",
      "type": "widget/answerBot/QUESTION_VALUE_CHANGED",
    }
  `)
})
