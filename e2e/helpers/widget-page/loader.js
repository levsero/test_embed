import { mockRollbarEndpoint, mockStaticAssets, goToTestPage, failOnConsoleError } from './../utils'
import { mockIdentifyEndpoint, mockBlipEndpoint } from './../blips'
import devices from 'puppeteer/DeviceDescriptors'

const defaultMocks = [
  mockRollbarEndpoint,
  mockStaticAssets,
  mockBlipEndpoint,
  mockIdentifyEndpoint()
]

/*
 * mockRequests provides a way for each test to hook into Puppeteer's request interception functionality
 * https://github.com/GoogleChrome/puppeteer/blob/master/docs/api.md#pagesetrequestinterceptionvalue
 *
 * Each mock request will be called with the request object and is expected to check if the request matches the one
 * the function wants to mock. If the request does not match, the function should return false.
 * E.g.
 *
 * const mockCatEndpoint = request => {
 *   if (!request.url().includes('cat')) {
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
    const fns = (mockFns || []).concat(defaultMocks)

    for (let i = 0; i < fns.length; i++) {
      if (fns[i](request) !== false) {
        return
      }
    }

    request.continue()
  })
}

// options
// - mockRequests [[fn]] An array of functions that will be provided to the mockRequests function
// - mobile [bool] If true, emulate mobile mode
// - beforeScriptLoads [fn] A callback that gets called before the widget loads
// - hidden [bool] If true, the widget is hidden initially so we don't wait for the widget to become visible
const load = async (options = {}) => {
  await jestPuppeteer.resetPage()
  await mockRequests(options.mockRequests)
  if (options.mobile) {
    await page.emulate(devices['iPhone 6'])
  }
  await page.evaluateOnNewDocument(() => {
    window.zEmbed ||
      (function(host) {
        var queue = []

        window.zEmbed = function() {
          queue.push(arguments)
        }

        window.zE = window.zE || window.zEmbed
        window.zEmbed.t = +new Date()
        document.zendeskHost = host
        document.zEQueue = queue
      })('z3nwebwidget2019.zendesk.com')
  })
  if (options.beforeScriptLoads) {
    options.beforeScriptLoads(page)
  }
  await failOnConsoleError(page)
  await goToTestPage()
  const selectorOptions = {
    visible: true
  }
  if (options.hidden) {
    selectorOptions.visible = false
  }
  await page.waitForSelector('iframe#launcher', selectorOptions)
}

export default load