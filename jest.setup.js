import '@testing-library/jest-dom/extend-expect'
import '@testing-library/react/cleanup-after-each'
import 'jest-styled-components'

jest.mock('translation/ze_localeIdMap', () => require('translation/__mocks__/ze_localeIdMap'), {
  virtual: true
})

jest.mock('translation/ze_countries', () => require('translation/__mocks__/ze_countries'), {
  virtual: true
})

jest.mock('component/Refocus')
jest.mock('src/redux/middleware/preventLoops/index')
jest.mock('src/embed/webWidget/webWidgetStyles')
jest.mock('src/embed/launcher/launcherStyles')
jest.mock('src/embed/sharedStyles')
jest.mock('globalCSS')
jest.mock('@zendesk/client-i18n-tools')

window.I18N = { translations: {} }
global.noop = () => {}

const mockMedia = () => ({
  matches: false,
  addListener: function() {},
  removeListener: function() {}
})

// setup needed for react-slick mocks
window.matchMedia = window.matchMedia || mockMedia
window.requestAnimationFrame = window.requestAnimationFrame || (callback => setTimeout(callback, 0))

// setup needed for popper.js
document.createRange = () => ({
  setStart: () => {},
  setEnd: () => {},
  commonAncestorContainer: {
    nodeName: 'BODY',
    ownerDocument: document
  }
})

document.zendeskHost = 'testingHost'

document.elementFromPoint = jest.fn()

// this is just a little hack to silence a warning that we'll get until react
// fixes this: https://github.com/facebook/react/pull/14853
/* eslint-disable no-console */
const originalError = console.error
beforeAll(() => {
  console.error = (...args) => {
    if (/Warning.*not wrapped in act/.test(args[0])) {
      return
    }
    originalError.call(console, ...args)
  }
})

afterAll(() => {
  console.error = originalError
})
/* eslint-enable no-console */

process.on('unhandledRejection', function(err, promise) {
  console.error('Unhandled rejection (promise: ', promise, ', reason: ', err, ').') // eslint-disable-line no-console
})
