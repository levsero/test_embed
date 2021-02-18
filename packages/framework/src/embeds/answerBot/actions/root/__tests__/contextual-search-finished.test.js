import { CONTEXTUAL_SEARCH_FINISHED } from '../action-types'
import * as actions from '../contextual-search-finished'

test('contextualSearchFinished dispatches expected payload', () => {
  expect(actions.contextualSearchFinished()).toEqual({
    type: CONTEXTUAL_SEARCH_FINISHED,
  })
})
