import { queries, wait } from 'pptr-testing-library'
import loadWidget from 'e2e/helpers/widget-page'
import widget from 'e2e/helpers/widget'
import launcher from 'e2e/helpers/launcher'
import { mockSearchEndpoint } from 'e2e/helpers/help-center-embed'
import searchResults from 'e2e/fixtures/responses/search-results'

const assertUrlIncludes = (endpoint, matches) => {
  expect(endpoint).toHaveBeenCalled()
  const url = endpoint.mock.calls[0][0]
  expect(url).toMatch(matches)
}

const assertSuggestionsShown = async () => {
  const doc = await widget.getDocument()
  await wait(async () => queries.getByText(doc, 'Here are some top suggestions for you:'))
  await wait(async () => {
    expect(await queries.queryByText(doc, 'Welcome to your Help Center!')).toBeTruthy()
  })
}

describe('contextual search', () => {
  describe('no results', () => {
    it('shows fallback message and get in touch button', async () => {
      await loadWidget()
        .withPresets('answerBotWithContextualHelp', 'contactForm')
        .intercept(mockSearchEndpoint({ results: [] }))
        .load()

      await widget.openByKeyboard()
      const doc = await widget.getDocument()
      await wait(async () => {
        expect(
          await queries.queryByText(doc, "Ask me a question and I'll find the answer for you.")
        ).toBeTruthy()
      })
      await wait(async () => {
        expect(await queries.queryByText(doc, 'Get in touch')).toBeTruthy()
      })
      expect(await queries.queryByText(doc, 'Here are some top suggestions for you:')).toBeFalsy()
    })
  })

  it('does not ask for feedback and contains original article link', async () => {
    await loadWidget()
      .withPresets('answerBotWithContextualHelp')
      .intercept(mockSearchEndpoint())
      .load()
    await widget.openByKeyboard()
    await assertSuggestionsShown()
    const doc = await widget.getDocument()
    const link = await queries.getByText(doc, 'Welcome to your Help Center!')
    await link.click()
    await queries.getByText(doc, 'This is the body.')
    expect(await queries.queryByTitle(doc, 'View original article')).toBeTruthy()
    await page.waitFor(3000)
    const feedback = await queries.queryByText(doc, 'Does this article answer your question?')
    expect(feedback).toBeNull()
  })

  describe('via config', () => {
    it('displays the contextual search results on open of widget', async () => {
      await loadWidget()
        .withPresets('answerBotWithContextualHelp')
        .intercept(mockSearchEndpoint())
        .load()
      await widget.openByKeyboard()
      await assertSuggestionsShown()
    })
  })

  describe('via api', () => {
    it('displays the contextual search results on open of widget', async () => {
      const endpoint = jest.fn()
      await loadWidget()
        .withPresets('answerBot')
        .intercept(mockSearchEndpoint(searchResults, endpoint))
        .evaluateAfterSnippetLoads(() => {
          zE('webWidget', 'helpCenter:setSuggestions', { search: 'help' })
        })
        .load()
      await launcher.click()
      await assertSuggestionsShown()
      assertUrlIncludes(endpoint, /query=help/)
    })

    it('scrapes the url from the host page for contextual search when url: true', async () => {
      const endpoint = jest.fn()
      await loadWidget()
        .withPresets('answerBot')
        .intercept(mockSearchEndpoint(searchResults, endpoint))
        .evaluateAfterSnippetLoads(() => {
          zE('webWidget', 'helpCenter:setSuggestions', { url: true })
        })
        .load()
      await launcher.click()
      await assertSuggestionsShown()
      assertUrlIncludes(endpoint, /query=e2e/)
    })
  })

  describe('via legacy api', () => {
    it('displays the contextual search results on open of widget', async () => {
      const endpoint = jest.fn()
      await loadWidget()
        .withPresets('answerBot')
        .intercept(mockSearchEndpoint(searchResults, endpoint))
        .load()
      await page.evaluate(() => {
        zE.setHelpCenterSuggestions({ labels: ['credit card', 'help'] })
      })
      await launcher.click()
      await assertSuggestionsShown()
      assertUrlIncludes(endpoint, /label_names=credit%20card%2Chelp/)
    })
  })
})
