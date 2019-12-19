import { queries, wait } from 'pptr-testing-library'
import widget from 'e2e/helpers/widget'
import searchResults from 'e2e/fixtures/search-results'
import { CORS_HEADERS } from './utils'

export const mockSearchEndpoint = (results = searchResults, callback) => request => {
  if (!request.url().includes('embeddable_search.json')) {
    return false
  }
  if (callback) {
    callback(request.url())
  }
  request.respond({
    status: 200,
    headers: CORS_HEADERS,
    contentType: 'application/json',
    body: JSON.stringify(results)
  })
}

export const waitForHelpCenter = async () => {
  const doc = await widget.getDocument()
  await wait(() => queries.getByPlaceholderText(doc, 'How can we help?'))
}
