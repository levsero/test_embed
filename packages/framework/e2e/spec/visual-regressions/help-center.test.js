/**
 * @group visual-regressions
 */

import { queries, wait } from 'pptr-testing-library'
import loadWidget from 'e2e/helpers/widget-page'
import widget from 'e2e/helpers/widget'
import { mockSearchEndpoint, waitForHelpCenter } from 'e2e/helpers/help-center-embed'
import { assertScreenshot } from 'e2e/helpers/visual-regressions'

const buildWidget = () => loadWidget().withPresets('helpCenter').intercept(mockSearchEndpoint())

const searchAndViewArticle = async (tag) => {
  await widget.openByKeyboard()
  await waitForHelpCenter()
  const doc = await widget.getDocument()
  await queries.getByPlaceholderText(doc, 'How can we help?')
  await assertScreenshot('hc-initial', { tag })
  await page.keyboard.type('welcome')
  await page.keyboard.press('Enter')
  await wait(() => queries.getByText(doc, 'Top results'))
  await assertScreenshot('hc-search-results', { tag })
  await widget.clickText('Welcome to your Help Center!')
  await assertScreenshot('hc-article', { tag })
}

test('help center desktop', async () => {
  await buildWidget().load()
  await searchAndViewArticle()
})

test('help center mobile', async () => {
  await buildWidget().useMobile().load()
  await searchAndViewArticle('mobile')
})

test('with contextual help', async () => {
  await buildWidget().load()
  await page.evaluate(() => {
    zE('webWidget', 'helpCenter:setSuggestions', { search: 'help' })
  })
  await widget.openByKeyboard()
  await waitForHelpCenter()
  await assertScreenshot('contextual-help')
})

test('with message button', async () => {
  await buildWidget().withPresets('contactForm', 'helpCenterWithContextualHelp').load()
  await widget.openByKeyboard()
  await waitForHelpCenter()
  await assertScreenshot('hc-with-contact-form-button')
})
