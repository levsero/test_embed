import '@testing-library/jest-dom/extend-expect'
import 'jest-styled-components'
import 'regenerator-runtime/runtime'
import t from '@zendesk/client-i18n-tools'
import classicUSTranslations from 'src/translation/classic/en-us.json'

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

window.matchMedia = window.matchMedia || mockMedia

document.elementFromPoint = jest.fn()
