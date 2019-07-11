import '@testing-library/jest-dom/extend-expect'
import '@testing-library/react/cleanup-after-each'

jest.mock('translation/locales.json')
jest.mock('translation/ze_localeIdMap')

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

process.on('unhandledRejection', function(err, promise) {
  console.error('Unhandled rejection (promise: ', promise, ', reason: ', err, ').') // eslint-disable-line no-console
})
