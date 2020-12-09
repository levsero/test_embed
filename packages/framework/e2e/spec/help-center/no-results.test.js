import { queries, wait } from 'pptr-testing-library'
import loadWidget from 'e2e/helpers/widget-page'
import { mockSearchEndpoint, waitForHelpCenter } from 'e2e/helpers/help-center-embed'
import launcher from 'e2e/helpers/launcher'
import widget from 'e2e/helpers/widget'

test('displays the expected message when there are no results', async () => {
  await loadWidget()
    .withPresets('helpCenter')
    .intercept(mockSearchEndpoint({ results: [] }))
    .load()

  await launcher.click()
  await waitForHelpCenter()
  await page.keyboard.type('welcome')
  await page.keyboard.press('Enter')
  const doc = await widget.getDocument()
  await wait(async () => {
    expect(await queries.queryByText(doc, 'There are no results for "welcome"')).toBeTruthy()
    expect(await queries.queryByText(doc, 'Try searching for something else.')).toBeTruthy()
  })
})
