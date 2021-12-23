import * as selectors from '../'

describe('shouldShowContextualResults', () => {
  test.each([
    [false, false, false, 0, false],
    [true, false, false, 0, false],
    [false, true, false, 0, false],
    [true, true, false, 1, true],
    [false, false, true, 0, true],
    [false, false, true, 1, false],
    [true, true, true, 1, true],
  ])(
    'when hasContextualSearched == %p && isContextualSearched == %p && contextualHelpRequestNeeded == %p, totalUserSearches %p, returns %p',
    (
      hasContextualSearched,
      isContextualSearchComplete,
      contextualHelpRequestNeeded,
      totalUserSearches,
      expectedValue
    ) => {
      const result = selectors.shouldShowContextualResults.resultFunc(
        hasContextualSearched,
        isContextualSearchComplete,
        contextualHelpRequestNeeded,
        totalUserSearches
      )

      expect(result).toEqual(expectedValue)
    }
  )
})

test('getPreviousActiveArticle', () => {
  const result = selectors.getPreviousActiveArticle({
    helpCenter: {
      clickedArticles: {
        current: 123,
        previous: 456,
      },
    },
  })

  expect(result).toEqual(456)
})

test('getSearchedArticles', () => {
  const result = selectors.getSearchedArticles({
    helpCenter: {
      searchedArticles: [1, 2],
      articles: {
        0: { a: 1 },
        1: { b: 2 },
        2: { c: 3 },
      },
    },
  })
  expect(result).toEqual([{ b: 2 }, { c: 3 }])
})
