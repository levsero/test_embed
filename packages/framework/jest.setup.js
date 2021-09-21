import '@testing-library/jest-dom/extend-expect'
import 'jest-styled-components'
import 'mutationobserver-shim'
import 'regenerator-runtime/runtime'

jest.mock(
  'src/translation/ze_localeIdMap',
  () => require('src/translation/__mocks__/ze_localeIdMap'),
  {
    virtual: true,
  }
)

jest.mock('src/translation/ze_countries', () => require('src/translation/__mocks__/ze_countries'), {
  virtual: true,
})

jest.mock('src/redux/middleware/preventLoops/index')
jest.mock('src/embed/webWidget/webWidgetStyles')
jest.mock('src/embed/sharedStyles')
jest.mock('@zendesk/client-i18n-tools')

global.__ZENDESK_CLIENT_I18N_GLOBAL = 'WWI18N'
global.noop = () => {}
global.URL.createObjectURL = jest.fn()

const mockMedia = () => ({
  matches: false,
  addListener: function () {},
  removeListener: function () {},
})

// setup needed for react-slick mocks
window.matchMedia = window.matchMedia || mockMedia
window.requestAnimationFrame =
  window.requestAnimationFrame || ((callback) => setTimeout(callback, 0))

// setup needed for popper.js
document.createRange = () => ({
  setStart: () => {},
  setEnd: () => {},
  commonAncestorContainer: {
    nodeName: 'BODY',
    ownerDocument: document,
  },
})

document.zendeskHost = 'testingHost'

document.elementFromPoint = jest.fn()
window.HTMLElement.prototype.scrollIntoView = () => undefined
global.MutationObserver = global.window.MutationObserver

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

// Hack for avoiding OOM errors when rendering resizable text areas
const actuallyGetComputedStyle = window.getComputedStyle

window.getComputedStyle = jest.fn().mockImplementation((arg) => {
  if (arg.type === 'textarea' && arg.hasAttribute('data-garden-id')) {
    return {
      getPropertyValue: () => {},
    }
  } else {
    return actuallyGetComputedStyle(arg)
  }
})

afterAll(() => {
  console.error = originalError
})
/* eslint-enable no-console */

process.on('unhandledRejection', function (err, promise) {
  console.error('Unhandled rejection (promise: ', promise, ', reason: ', err, ').') // eslint-disable-line no-console
})
