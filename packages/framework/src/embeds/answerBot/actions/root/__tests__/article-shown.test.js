import * as actions from '../article-shown'

test('articleShown dispatches expected payload', () => {
  expect(actions.articleShown('1', '2')).toMatchInlineSnapshot(`
    Object {
      "payload": Object {
        "articleID": "2",
        "sessionID": "1",
      },
      "type": "widget/answerBot/ARTICLE_SHOWN",
    }
  `)
})
