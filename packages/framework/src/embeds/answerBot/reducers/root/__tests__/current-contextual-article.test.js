import * as actionTypes from 'src/embeds/answerBot/actions/root/action-types'
import reducer from '../current-contextual-article'

test('initial state is null', () => {
  expect(reducer(undefined, { type: '' })).toBeNull()
})

test('updates to expected state', () => {
  const state = reducer(undefined, {
    type: actionTypes.CONTEXTUAL_ARTICLE_SHOWN,
    payload: {
      articleID: 'two',
    },
  })

  expect(state.articleID).toEqual('two')
})

test('updates to expected state', () => {
  const state = reducer(
    { articleID: 'two' },
    {
      type: actionTypes.ARTICLE_SHOWN,
      payload: {
        articleID: 'two',
      },
    }
  )

  expect(state).toEqual(null)
})
