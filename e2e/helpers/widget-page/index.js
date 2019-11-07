import { mockEmbeddableConfigEndpoint } from './embeddable-config'
import { mockBlipEndpoint, goToTestPage } from './../utils'

const defaultMocks = [mockBlipEndpoint]

/*
 * mockRequests provides a way for each test to hook into Puppeteer's request interception functionality
 * https://github.com/GoogleChrome/puppeteer/blob/master/docs/api.md#pagesetrequestinterceptionvalue
 *
 * Each mock request will be called with the request object and is expected to check if the request matches the one
 * the function wants to mock. If the request does not match, the function should return false.
 * E.g.
 *
 * const mockCatEndpoint = request => {
 *   if (!request.url().contains('cat') {
 *     // return false since the url is not the cat endpoint
 *     return false
 *   }
 *
 *   // mock out request
 * }
 */
const mockRequests = async mockFns => {
  await page.setRequestInterception(true)
  await page.on('request', request => {
    const fns = defaultMocks.concat(...mockFns)

    for (let i = 0; i < fns.length; i++) {
      if (fns[i](request) !== false) {
        return
      }
    }

    request.continue()
  })
}

// options
// - mockRequests [fn] An array of functions that will be provided to the mockRequests function
const load = async (options = {}) => {
  await jestPuppeteer.resetPage()
  await mockRequests(options.mockRequests)
  await goToTestPage()
  await page.waitForSelector('iframe#launcher', { visible: true })
}

const loadWithConfig = async (...configs) => {
  await load({ mockRequests: [mockEmbeddableConfigEndpoint(...configs)] })
}

export default {
  loadWithConfig,
  load
}
