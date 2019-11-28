import searchResults from 'e2e/fixtures/search-results'

export const mockSearchEndpoint = (results = searchResults) => request => {
  if (!request.url().includes('embeddable_search.json')) {
    return false
  }
  request.respond({
    status: 200,
    headers: { 'Access-Control-Allow-Origin': '*' },
    contentType: 'application/json',
    body: JSON.stringify(results)
  })
}
