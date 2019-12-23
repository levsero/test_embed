import { queries, wait } from 'pptr-testing-library'
import widget from 'e2e/helpers/widget'
import searchResults from 'e2e/fixtures/responses/search-results.json'
import { DEFAULT_CORS_HEADERS, mockCorsRequest } from './utils'

export const mockSearchEndpoint = (results = searchResults, callback) => {
  return mockCorsRequest('embeddable_search.json', request => {
    if (callback) {
      callback(request.url())
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
  const doc = await widget.getDocument()
  await wait(() => queries.getByPlaceholderText(doc, 'How can we help?'))
}
