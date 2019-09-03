import * as selectors from '../'

describe('shouldShowContextualResults', () => {
  test.each([
    [false, false, false, false],
    [true, false, false, false],
    [false, true, false, false],
    [true, true, false, true],
    [false, false, true, true],
    [true, true, true, true]
  ])(
    'when hasContextualSearched == %p && isContextualSearched == %p && contextualHelpRequestNeeded == %p, returns %p',
    (
      hasContextualSearched,
      isContextualSearchComplete,
      contextualHelpRequestNeeded,
      expectedValue
    ) => {
      const result = selectors.shouldShowContextualResults.resultFunc(
        hasContextualSearched,
        isContextualSearchComplete,
        contextualHelpRequestNeeded
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
        previous: 456
      }
    }
  })
  expect(result).toEqual(456)
})
