import '@testing-library/jest-dom/extend-expect'
import 'jest-styled-components'
import 'regenerator-runtime/runtime'
import t from '@zendesk/client-i18n-tools'
import classicUSTranslations from 'messengerSrc/features/i18n/gen/translations/en-us.json'

beforeAll(() => {
  t.set(classicUSTranslations.locale)
})

global.__ZENDESK_CLIENT_I18N_GLOBAL = 'WWI18N'
global.noop = () => {}

const mockMedia = () => ({
  matches: false,
  addListener: function () {},
  removeListener: function () {},
})

document.zendeskHost = 'testingHost'

window.matchMedia = window.matchMedia || mockMedia

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
