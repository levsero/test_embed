import { queries, wait } from 'pptr-testing-library'
import loadWidget from 'e2e/helpers/widget-page'
import { mockSearchEndpoint, waitForHelpCenter } from 'e2e/helpers/help-center-embed'
import launcher from 'e2e/helpers/launcher'
import widget from 'e2e/helpers/widget'
import searchResults from 'e2e/fixtures/responses/search-results-with-empty-article.json'
import { TEST_IDS } from 'src/constants/shared'

const notInSearchResultsScreen = async (doc) => {
  await wait(async () => {
    expect(await queries.queryByText(doc, 'Top results')).not.toBeTruthy()
  })
}

const waitForSearchResultsScreen = () => widget.waitForText('Top results')

const clickArticle = async (title) => {
  await waitForSearchResultsScreen()
  const doc = await widget.getDocument()
  await waitForSearchResultsScreen()
  const titleLink = await queries.getByText(doc, title)
  await titleLink.click()
  await notInSearchResultsScreen(doc)
}

test('displays no article contents for empty article', async () => {
  await loadWidget().withPresets('helpCenter').intercept(mockSearchEndpoint(searchResults)).load()

  await launcher.click()
  await waitForHelpCenter()
  await page.keyboard.type('welcome')
  await page.keyboard.press('Enter')

  const doc = await widget.getDocument()
  await clickArticle('Empty Article')
  const body = await queries.getByTestId(doc, TEST_IDS.HC_ARTICLE_BODY)
  const articleText = await (await body.getProperty('textContent')).jsonValue()
  expect(articleText).toEqual('')
  await widget.clickBack()
  await clickArticle('Non-empty Article 2')
  expect(await queries.queryByText(doc, 'Non-Empty Article Body 2')).toBeTruthy()
})
