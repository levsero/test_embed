import t from '@zendesk/client-i18n-tools'
import errorTracker from 'src/framework/services/errorTracker'
import listeners from 'src/framework/services/i18n/listeners'
import parseLocale from 'src/framework/services/i18n/parseLocale'
import { navigator } from 'src/util/globals'
import zELocaleIdMap from 'translation/ze_localeIdMap'
import fetchLocale from './fetchLocale'

let currentLocale

const getBrowserLocale = () => {
  const nav = navigator

  return (nav.languages && nav.languages[0]) || nav.browserLanguage || nav.language || 'en-US'
}

const setLocale = (newLocale = 'en-us') => {
  const nextLocale = parseLocale(newLocale, getBrowserLocale())

  if (!nextLocale) {
    return
  }

  currentLocale = nextLocale

  return fetchLocale(nextLocale)
    .then((res) => {
      const translations = res.default.locale

      if (currentLocale !== translations.locale) {
        return { success: false }
      }

      window[global.__ZENDESK_CLIENT_I18N_GLOBAL] = undefined
      t.set(translations)

      listeners.notifyAll()

      return { success: true }
    })
    .catch((err) => {
      errorTracker.error('Failed loading locale', err.message)
      return { success: false }
    })
}

const translate = (key, ...options) => {
  const translation = t(key, ...options)

  const locale = t.getLocale()

  if (key === translation || !translation) {
    return `Missing translation (${locale}): ${key}`
  }

  return translation
}

const getLocaleId = () => {
  return zELocaleIdMap[t.getLocale()]
}

const isRTL = () => t.dir === 'rtl'

export default {
  setLocale,
  translate,
  getBrowserLocale,
  getLocale: t.getLocale,
  getLocaleId,
  getInternalCurrentLocale: () => currentLocale,
  subscribe: listeners.subscribe,
  parseLocale,
  isRTL,
}
