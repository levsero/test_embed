import { queries, wait } from 'pptr-testing-library'
import widget from 'e2e/helpers/widget'
import searchResults from 'e2e/fixtures/responses/answer-bot-interaction.json'
import { DEFAULT_CORS_HEADERS, mockCorsRequest } from './utils'

export const mockInteractionEndpoint = (results = searchResults, callback) => {
  return mockCorsRequest('/api/v2/answer_bot/interaction', request => {
    if (callback) {
      callback(request.postData())
    }
    request.respond({
      status: 200,
      headers: DEFAULT_CORS_HEADERS,
      contentType: 'application/json',
      body: JSON.stringify(results)
    })
  })
}

export const mockViewedEndpoint = callback => {
  return mockCorsRequest('/api/v2/answer_bot/viewed', request => {
    if (callback) {
      callback(request.postData())
    }
    request.respond({
      status: 200,
      headers: DEFAULT_CORS_HEADERS,
      contentType: 'application/json'
    })
  })
}

export const mockResolutionEndpoint = callback => {
  return mockCorsRequest('/api/v2/answer_bot/resolution', request => {
    if (callback) {
      callback(request.postData())
    }
    request.respond({
      status: 200,
      headers: DEFAULT_CORS_HEADERS,
      contentType: 'application/json'
    })
  })
}

export const mockRejectionEndpoint = callback => {
  return mockCorsRequest('/api/v2/answer_bot/rejection', request => {
    if (callback) {
      callback(request.postData())
    }
    request.respond({
      status: 200,
      headers: DEFAULT_CORS_HEADERS,
      contentType: 'application/json'
    })
  })
}

export const waitForAnswerBot = async () => {
  const doc = await widget.getDocument()
  await wait(() => queries.getByText(doc, "Ask me a question and I'll find the answer for you."))
}

export const search = async query => {
  const doc = await widget.getDocument()
  const input = await queries.getByPlaceholderText(doc, 'Type your question here...')
  await input.focus()
  await page.keyboard.type(query)
  await page.keyboard.press('Enter')
  // delay for bot typing animation
  await page.waitFor(100)
}
