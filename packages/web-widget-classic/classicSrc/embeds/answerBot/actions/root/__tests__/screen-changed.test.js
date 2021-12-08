import * as actions from '../screen-changed'

test('screenChanged dispatches expected payload', () => {
  expect(actions.screenChanged('article')).toMatchInlineSnapshot(`
    Object {
      "payload": "article",
      "type": "widget/answerBot/SCREEN_CHANGED",
    }
  `)
})
