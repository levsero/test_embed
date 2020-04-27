import { queries } from 'pptr-testing-library'
import widget from 'e2e/helpers/widget'
import searchResults from 'e2e/fixtures/responses/search-results.json'
import { DEFAULT_CORS_HEADERS, mockCorsRequest } from './utils'
import { TEST_IDS } from 'src/constants/shared'

export const mockSearchEndpoint = (results = searchResults, callback) => {
  return mockCorsRequest('embeddable_search.json', request => {
    if (callback) {
      callback(request.url(), request.headers())
    }
    request.respond({
      status: 200,
      headers: DEFAULT_CORS_HEADERS,
      contentType: 'application/json',
      body: JSON.stringify(results)
    })
  })
}

export const waitForHelpCenter = async () => {
  await widget.waitForPlaceholderText('How can we help?')
}

export const search = async keyword => {
  const doc = await widget.getDocument()
  const input = await queries.getByPlaceholderText(doc, 'How can we help?')
  await input.focus()
  await page.keyboard.type(keyword)
  await page.keyboard.press('Enter')
}

export const clickClearInputIcon = async () => {
  const doc = await widget.getDocument()
  const clearButton = await queries.getByTestId(doc, TEST_IDS.ICON_CLEAR_INPUT)
  await clearButton.click()
}
