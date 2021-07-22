import launcher from 'e2e/helpers/launcher'
import devices from 'puppeteer/DeviceDescriptors'
import { mockIdentifyEndpoint, mockBlipEndpoint } from './../blips'
import { mockHcStatsEndpoint } from './../hc-stats'
import { mockRollbarEndpoint, mockStaticAssets, goToTestPage, failOnConsoleError } from './../utils'

const defaultMocks = [
  mockRollbarEndpoint,
  mockStaticAssets,
  mockBlipEndpoint(),
  mockIdentifyEndpoint(),
  mockHcStatsEndpoint(),
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
const mockRequests = async (mockFns) => {
  await page.setRequestInterception(true)
  await page.on('request', (request) => {
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
// - beforeSnippetLoads [fn] A callback that gets called before the widget snippet loads
// - afterSnippetLoads [fn] A callback that gets called after the widget snippet loads
// - hidden [bool] If true, the widget is hidden initially so we don't wait for the widget to become visible
const load = async (options = {}) => {
  await jestPuppeteer.resetPage()
  await mockRequests(options.mockRequests)
  if (options.mobile) {
    await page.emulate(devices['iPhone 6'])
  }
  if (options.beforeSnippetLoads) {
    options.beforeSnippetLoads(page)
  }
  await failOnConsoleError(page)
  await goToTestPage()
  if (options.afterSnippetLoads) {
    options.afterSnippetLoads(page)
  }
  const launcherFrame = await launcher.getFrame()
  if (options.waitForLauncherToLoad) {
    await launcherFrame.waitForSelector('#Embed', { visible: true })
  } else {
    await launcherFrame.waitForSelector('#Embed')
  }
}

export default load
