import { queries, wait } from 'pptr-testing-library'
import loadWidget from 'e2e/helpers/widget-page'
import launcher from 'e2e/helpers/launcher'
import widget from 'e2e/helpers/widget'
import { search, mockSearchEndpoint, waitForHelpCenter } from 'e2e/helpers/help-center-embed'
import searchResults from 'e2e/fixtures/responses/search-results.json'
import { DEFAULT_CORS_HEADERS, mockCorsRequest } from 'e2e/helpers/utils'

const mockAuthSuccessEndpoint = callback => {
  return mockCorsRequest('embeddable/authenticate', request => {
    callback(request.url())
    request.respond({
      status: 200,
      headers: DEFAULT_CORS_HEADERS,
      contentType: 'application/json',
      body: JSON.stringify({
        oauth_token: 'faketoken',
        oauth_expiry: Date.now() + 100000,
        oauth_created_at: Date.now()
      })
    })
  })
}

const searchAndWaitForResults = async () => {
  await search('Help')
  const doc = await widget.getDocument()
  await wait(() => queries.getByText(doc, 'Top results'))
}

const searchEndpoint = jest.fn(),
  authenticateEndpoint = jest.fn()

const buildWidget = () =>
  loadWidget()
    .withPresets('helpCenter')
    .intercept(mockSearchEndpoint(searchResults, searchEndpoint))
    .intercept(mockAuthSuccessEndpoint(authenticateEndpoint))
    .evaluateOnNewDocument(() => {
      window.zESettings = {
        authenticate: { jwt: 'authtoken' }
      }
    })

test('searches help center with the expected authentication token', async () => {
  await buildWidget().load()
  await launcher.click()
  await waitForHelpCenter()
  await searchAndWaitForResults()
  expect(authenticateEndpoint).toHaveBeenCalled()
  expect(searchEndpoint).toHaveBeenCalled()
  const headers = searchEndpoint.mock.calls[0][1]
  expect(headers.authorization).toEqual('Bearer faketoken')
})

test('help center images include token as well', async () => {
  const image = jest.fn()
  await buildWidget()
    .intercept(
      mockCorsRequest('/hc/en-us/image.jpg', request => {
        image(request.headers())
        request.respond({
          status: 200,
          headers: DEFAULT_CORS_HEADERS,
          contentType: 'image/jpg'
        })
      })
    )
    .load()
  await launcher.click()
  await waitForHelpCenter()
  await searchAndWaitForResults()
  const frame = await widget.getDocument()
  await expect(frame).toClick('a', { text: 'What are these sections and articles doing here?' })
  await wait(() => expect(image).toHaveBeenCalled())
  const headers = image.mock.calls[0][0]
  expect(headers.authorization).toEqual('Bearer faketoken')
})

test('logout clears the token', async () => {
  await buildWidget().load()
  await launcher.click()
  await waitForHelpCenter()
  await searchAndWaitForResults()
  expect(authenticateEndpoint).toHaveBeenCalled()
  expect(searchEndpoint).toHaveBeenCalled()
  searchEndpoint.mockClear()
  await page.evaluate(() => zE('webWidget', 'logout'))
  await wait(async () => {
    await expect(launcher).toBeVisible()
  })
  await widget.openByKeyboard()
  await searchAndWaitForResults()
  const headers = searchEndpoint.mock.calls[0][1]
  expect(headers.authorization).toEqual('')
})
