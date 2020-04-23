import _ from 'lodash'
import { sprintf } from 'sprintf-js'
import t from '@zendesk/client-i18n-tools'
import zELocaleIdMap from 'translation/ze_localeIdMap'
import { LOCALE_SET } from 'src/redux/modules/base/base-action-types'
import { getLocale as getLocaleState } from 'src/redux/modules/base/base-selectors'
import { navigator } from 'utility/globals'

let store
let currentLocale
const locales = Object.keys(zELocaleIdMap)

// reset is only used in tests

function reset() {
  store = undefined
  // currentLocale is used to ensure when booting it respects a previously set locale
  currentLocale = undefined
}

function init(s) {
  store = s
}

function setLocale(apiLocale, callback, configLocale = 'en-US') {
  if (!store) return

  currentLocale = parseLocale(apiLocale || currentLocale || configLocale)

  global
    .fetchLocale(currentLocale)
    .then(res => {
      const translations = res.default.locale

      if (currentLocale !== translations.locale) return

      window[global.__ZENDESK_CLIENT_I18N_GLOBAL] = undefined

      t.set(translations)

      store.dispatch({
        type: LOCALE_SET,
        payload: currentLocale
      })

      if (callback) {
        callback()
      }
    })
    .catch(() => {})
}

function translate(key, params = {}) {
  const translation = t(key)

  const locale = getLocale()

  if (_.isUndefined(translation)) {
    return getMissingTranslationString(key, locale)
  }

  return interpolateTranslation(translation, params)
}

function dateTimeFormat(timestamp, options = {}) {
  return t.dateTimeFormat(options).format(timestamp)
}

function getLocale() {
  if (!store) return ''
  return getLocaleState(store.getState())
}

function getLocaleId() {
  return zELocaleIdMap[getLocale()]
}

function isRTL() {
  return t.dir === 'rtl'
}

// private

function getMissingTranslationString(key, locale) {
  return `Missing translation (${locale}): ${key}`
}

function interpolateTranslation(translation, args) {
  try {
    return sprintf(translation, args)
  } catch (_) {
    return translation
  }
}

function regulateDash(locale) {
  return _.replace(locale, '_', '-')
}

function regulateLocaleStringCase(locale) {
  const dashIndex = locale.indexOf('-')

  if (dashIndex < 0) {
    return locale.toLowerCase()
  }
  return locale.substring(0, dashIndex).toLowerCase() + locale.substring(dashIndex).toUpperCase()
}

function getClientLocale() {
  const nav = navigator

  return (nav.languages && nav.languages[0]) || nav.browserLanguage || nav.language || 'en-US'
}

function parseLocale(str) {
  const locale = regulateLocaleStringCase(regulateDash(str))
  const lowercaseLocale = locale.toLowerCase()
  const extractedLang = locale.substring(0, locale.indexOf('-'))

  if (_.includes(locales, locale)) {
    return locale
  } else if (_.includes(locales, lowercaseLocale)) {
    return lowercaseLocale
  } else if (_.includes(locales, extractedLang)) {
    return extractedLang
  } else if (str === 'tl') {
    return 'fil'
  } else if (_.startsWith(str, 'zh')) {
    return parseZhLocale(str)
  } else {
    return 'en-US'
  }
}

// logic taken from https://www.drupal.org/project/drupal/issues/365615
function parseZhLocale(str) {
  str = str.toLowerCase()
  const parts = _.split(str, '-')

  if (parts.length > 2) {
    const middle = parts[1]

    if (middle === 'hant') {
      if (parts[2] === 'mo') {
        return 'zh-mo'
      } else {
        return 'zh-tw'
      }
    } else if (middle === 'hans') {
      if (parts[2] === 'sg') {
        return 'zh-sg'
      } else {
        return 'zh-cn'
      }
    }
  }

  switch (str) {
    case 'zh-cn':
    case 'zh-my':
    case 'zh-hans':
    case 'zh':
      return 'zh-cn'
    case 'zh-hant':
      return 'zh-tw'
    default:
      return 'zh-cn'
  }
}

// Retrieves the correct translation from the passed map of settings translations.
const getSettingTranslation = translations => {
  if (_.isEmpty(translations)) return

  return translations[i18n.getLocale()] || translations['*'] || null
}

const initFetchLocale = () => {
  global.fetchLocale = locale =>
    import(
      /* webpackChunkName: "locales/[request]" */ `src/translation/locales/${locale.toLowerCase()}.json`
    ).catch(() => {})
  global.__ZENDESK_CLIENT_I18N_GLOBAL = 'WW_I18N'
}

export const i18n = {
  t: translate,
  dateTimeFormat: dateTimeFormat,
  getLocaleId: getLocaleId,
  setLocale: setLocale,
  getLocale: getLocale,
  isRTL: isRTL,
  setCustomTranslations: () => {},
  getSettingTranslation: getSettingTranslation,
  init: init,
  reset,
  parseLocale,
  getClientLocale,
  initFetchLocale
}
