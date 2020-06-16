import 'core-js/modules/es6.promise'
import 'core-js/modules/es6.array.iterator'

global.fetchLocale = locale =>
  import(
    /* webpackChunkName: "locales/[request]" */ `./translation/locales/${locale.toLowerCase()}.json`
  ).catch(() => {})
global.__ZENDESK_CLIENT_I18N_GLOBAL = 'WW_I18N'

let localeFetched = false

if (document.zEQueue) {
  for (let i = 0; i < document.zEQueue.length; i++) {
    const args = document.zEQueue[i]
    if (args[1] === 'setLocale' && args[2]) {
      global.fetchLocale(args[2])
      localeFetched = true
    }
  }
}

if (window.ACFetch) {
  global.configRequest = window
    .ACFetch(`https://${window.document.zendesk.web_widget.id}/embeddable/config`)
    .then(config => {
      if (!localeFetched) {
        global.fetchLocale(config.locale ?? 'en-US')
      }

      return {
        success: true,
        config
      }
    })
    .catch(() => ({
      success: false
    }))
}

import(/* webpackChunkName: "web_widget" */ './main')
