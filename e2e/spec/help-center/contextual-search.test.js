import { queries, wait } from 'pptr-testing-library'
import widgetPage from 'e2e/helpers/widget-page'
import widget from 'e2e/helpers/widget'
import launcher from 'e2e/helpers/launcher'
import { mockSearchEndpoint } from 'e2e/helpers/help-center-embed'

describe('contextual search', () => {
  const assertSuggestionsShown = async () => {
    const doc = await widget.getDocument()
    await wait(async () => queries.getByText(doc, 'Top suggestions'))
    await wait(async () => {
      expect(await queries.queryByText(doc, 'Welcome to your Help Center!')).toBeTruthy()
    })
  }

  describe('no results', () => {
    it('opens up to search page', async () => {
      await widgetPage.loadWithConfig(
        'helpCenterWithContextualHelp',
        mockSearchEndpoint({ results: [] })
      )
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
      await widgetPage.loadWithConfig('helpCenterWithContextualHelp', mockSearchEndpoint())
      await widget.openByKeyboard()
      await assertSuggestionsShown()
    })
  })

  describe('via api', () => {
    it('displays the contextual search results on open of widget', async () => {
      await widgetPage.loadWithConfig('helpCenter', mockSearchEndpoint())
      await page.evaluate(() => {
        zE('webWidget', 'helpCenter:setSuggestions', { search: 'help' })
      })
      await launcher.click()
      await assertSuggestionsShown()
    })
  })

  describe('via legacy api', () => {
    it('displays the contextual search results on open of widget', async () => {
      await widgetPage.loadWithConfig('helpCenter', mockSearchEndpoint())
      await page.evaluate(() => {
        zE.setHelpCenterSuggestions({ labels: ['credit card', 'help'] })
      })
      await launcher.click()
      await assertSuggestionsShown()
    })
  })
})
