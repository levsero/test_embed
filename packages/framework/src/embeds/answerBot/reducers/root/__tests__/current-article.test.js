import reducer from '../current-article'
import * as actionTypes from 'src/embeds/answerBot/actions/root/action-types'

test('initial state is null', () => {
  expect(reducer(undefined, { type: '' })).toBeNull()
})

test('updates to expected state', () => {
  const state = reducer(undefined, {
    type: actionTypes.ARTICLE_SHOWN,
    payload: {
      sessionID: 'one',
      articleID: 'two',
    },
  })

  expect(state).toMatchInlineSnapshot(`
    Object {
      "articleID": "two",
      "sessionID": "one",
    }
  `)
})
