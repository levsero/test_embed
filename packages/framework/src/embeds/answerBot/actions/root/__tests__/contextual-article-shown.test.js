import { CONTEXTUAL_ARTICLE_SHOWN } from '../action-types'
import * as actions from '../contextual-article-shown'

test('contextualArticleShown dispatches expected payload', () => {
  expect(actions.contextualArticleShown('1')).toEqual({
    type: CONTEXTUAL_ARTICLE_SHOWN,
    payload: { articleID: '1' }
  })
})
