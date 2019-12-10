import { mockEmbeddableConfigEndpoint } from './embeddable-config'
import { goToTestPage, failOnConsoleError } from './../utils'
import { mockIdentifyEndpoint, mockBlipEndpoint } from './../blips'
import _ from 'lodash'
import devices from 'puppeteer/DeviceDescriptors'

const defaultMocks = [mockBlipEndpoint, mockIdentifyEndpoint()]

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
// - mockRequests [fn] An array of functions that will be provided to the mockRequests function
// - mobile [bool] If true, emulate mobile mode
// - preload [fn] A function that will be executed once the page is navigated to.
// https://github.com/puppeteer/puppeteer/blob/master/docs/api.md#pageevaluateonnewdocumentpagefunction-args
// - preloadArgs [array] An array of arguments to supply to preload
const load = async (options = {}) => {
  await jestPuppeteer.resetPage()
  await mockRequests(options.mockRequests)
  if (options.mobile) {
    await page.emulate(devices['iPhone 6'])
  }
  if (options.preload) {
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
    const args = options.preloadArgs || []
    await page.evaluateOnNewDocument(options.preload, ...args)
  }
  failOnConsoleError(page)
  await goToTestPage()
  await page.waitForSelector('iframe#launcher', { visible: true })
}

const loadWithConfig = async (...args) => {
  const last = _.last(args)
  let mockRequests
  if (_.isFunction(last)) {
    mockRequests = [mockEmbeddableConfigEndpoint(..._.initial(args)), last]
  } else {
    mockRequests = [mockEmbeddableConfigEndpoint(...args)]
  }
  await load({ mockRequests })
}

export default {
  loadWithConfig,
  load
}
