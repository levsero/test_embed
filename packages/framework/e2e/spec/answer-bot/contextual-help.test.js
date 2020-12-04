import { queries } from 'pptr-testing-library'
import loadWidget from 'e2e/helpers/widget-page'
import widget from 'e2e/helpers/widget'
import launcher from 'e2e/helpers/launcher'
import { mockSearchEndpoint } from 'e2e/helpers/help-center-embed'
import { waitForAnswerBot, waitForGetInTouchButton } from 'e2e/helpers/answer-bot-embed'
import searchResults from 'e2e/fixtures/responses/search-results'

const assertUrlIncludes = (endpoint, matches) => {
  expect(endpoint).toHaveBeenCalled()
  const url = endpoint.mock.calls[0][0]
  expect(url).toMatch(matches)
}

const waitForArticleSuggestions = async () => {
  await widget.waitForText('Here are some top suggestions for you:')
  await widget.waitForText('How do I publish my content in other languages?')
}

describe('contextual search', () => {
  describe('no results', () => {
    it('shows fallback message and get in touch button', async () => {
      await loadWidget()
        .withPresets('answerBotWithContextualHelp', 'contactForm')
        .intercept(mockSearchEndpoint({ results: [] }))
        .load()

      await widget.openByKeyboard()
      await waitForAnswerBot()
      await waitForGetInTouchButton()
      await widget.expectNotToSeeText('Here are some top suggestions for you:')
    })
  })

  it('does not ask for feedback and contains original article link', async () => {
    await loadWidget()
      .withPresets('answerBotWithContextualHelp')
      .intercept(mockSearchEndpoint())
      .load()
    await widget.openByKeyboard()
    await waitForArticleSuggestions()
    await widget.clickText('Welcome to your Help Center!')
    await widget.waitForText('This is the body.')
    const link = await queries.queryByTitle(await widget.getDocument(), 'View original article')
    expect(link).toBeTruthy()
    await page.waitFor(3000)
    await widget.expectNotToSeeText('Does this article answer your question?')
  })

  describe('via config', () => {
    it('displays the contextual search results on open of widget', async () => {
      await loadWidget()
        .withPresets('answerBotWithContextualHelp')
        .intercept(mockSearchEndpoint())
        .load()
      await widget.openByKeyboard()
      await waitForArticleSuggestions()
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
      await waitForArticleSuggestions()
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
      await waitForArticleSuggestions()
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
      await waitForArticleSuggestions()
      assertUrlIncludes(endpoint, /label_names=credit%20card%2Chelp/)
    })
  })
})
