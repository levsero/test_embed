import 'core-js/modules/es6.promise'
import 'core-js/modules/es6.array.iterator'

if (window.ACFetch) {
  global.configRequest = window
    .ACFetch(`https://${window.document.zendesk.web_widget.id}/embeddable/config`)
    .then(config => {
      global.fetchLocale(config.locale ?? 'en-US')

      return {
        success: true,
        config
      }
    })
    .catch(() => ({
      success: false
    }))
}

global.fetchLocale = locale =>
  import(
    /* webpackChunkName: "locales/[request]" */ `./translation/locales/${locale.toLowerCase()}.json`
  ).catch(() => {})
global.__ZENDESK_CLIENT_I18N_GLOBAL = 'WW_I18N'

import(/* webpackChunkName: "web_widget" */ './main')
