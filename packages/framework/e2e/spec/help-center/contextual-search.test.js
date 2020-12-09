import { queries, wait } from 'pptr-testing-library'
import loadWidget from 'e2e/helpers/widget-page'
import widget from 'e2e/helpers/widget'
import launcher from 'e2e/helpers/launcher'
import { mockSearchEndpoint } from 'e2e/helpers/help-center-embed'
import searchResults from 'e2e/fixtures/responses/search-results.json'

const assertUrlIncludes = (endpoint, matches) => {
  expect(endpoint).toHaveBeenCalled()
  const url = endpoint.mock.calls[0][0]
  expect(url).toMatch(matches)
}

const assertSuggestionsShown = async () => {
  const doc = await widget.getDocument()
  await wait(async () => queries.getByText(doc, 'Top suggestions'))
  await wait(async () => {
    expect(await queries.queryByText(doc, 'Welcome to your Help Center!')).toBeTruthy()
  })
}

const buildWidget = preset => loadWidget().withPresets(preset)
const buildWidgetWithSeachEndpointSpy = async () => {
  const endpoint = jest.fn()
  await buildWidget('helpCenter')
    .intercept(mockSearchEndpoint(searchResults, endpoint))
    .load()
  return endpoint
}

describe('contextual search', () => {
  describe('no results', () => {
    it('opens up to search page', async () => {
      await buildWidget('helpCenterWithContextualHelp')
        .intercept(mockSearchEndpoint({ results: [] }))
        .load()
      await widget.openByKeyboard()
      expect(
        await queries.queryByText(
          await widget.getDocument(),
          'Enter a term in the search bar above to find articles.'
        )
      ).toBeTruthy
    })
  })

  describe('via config', () => {
    it('displays the contextual search results on open of widget', async () => {
      await buildWidget('helpCenterWithContextualHelp')
        .intercept(mockSearchEndpoint())
        .load()
      await widget.openByKeyboard()
      await assertSuggestionsShown()
    })
  })

  describe('via api', () => {
    it('displays the contextual search results on open of widget', async () => {
      const endpoint = await buildWidgetWithSeachEndpointSpy()
      await page.evaluate(() => {
        zE('webWidget', 'helpCenter:setSuggestions', { search: 'help' })
      })
      await launcher.click()
      await assertSuggestionsShown()
      assertUrlIncludes(endpoint, /query=help/)
    })

    it('scrapes the url from the host page for contextual search when url: true', async () => {
      const endpoint = await buildWidgetWithSeachEndpointSpy()
      await page.evaluate(() => {
        zE('webWidget', 'helpCenter:setSuggestions', { url: true })
      })
      await launcher.click()
      await assertSuggestionsShown()
      assertUrlIncludes(endpoint, /query=e2e/)
    })
  })

  describe('via legacy api', () => {
    it('displays the contextual search results on open of widget', async () => {
      const endpoint = await buildWidgetWithSeachEndpointSpy()
      await page.evaluate(() => {
        zE.setHelpCenterSuggestions({ labels: ['credit card', 'help'] })
      })
      await launcher.click()
      await assertSuggestionsShown()
      assertUrlIncludes(endpoint, /label_names=credit%20card%2Chelp/)
    })
  })
})
