import 'core-js/modules/es6.promise'
import 'core-js/modules/es6.array.iterator'

const OK_RESPONSE = 200

function fakeFetch(url) {
  return new Promise((resolve, reject) => {
    const req = new XMLHttpRequest()

    req.open('GET', url, true)
    req.responseType = 'json'

    req.onload = () => {
      if (req.status === OK_RESPONSE) {
        const rawRes = req.response
        const json = typeof rawRes === 'string' ? JSON.parse(rawRes) : rawRes

        resolve(json)
      } else {
        reject(Error(req.statusText))
      }
    }

    req.onerror = () => {
      reject(Error('Network error'))
    }

    req.send()
  })
}

global.fetchLocale = locale =>
  import(
    /* webpackChunkName: "locales/[request]" */ `./translation/locales/${locale.toLowerCase()}.json`
  )
global.__ZENDESK_CLIENT_I18N_GLOBAL = 'WW_I18N'

let localeFetched = false

if (document.zEQueue) {
  for (let i = 0; i < document.zEQueue.length; i++) {
    const args = document.zEQueue[i]
    if (args[1] === 'setLocale' && args[2]) {
      global.fetchLocale(args[2]).catch(() => {})
      localeFetched = true
    }
  }
}
window.ACFetch = fakeFetch

if (window.ACFetch) {
  global.configRequest = window
    .ACFetch(`https://z3n-lserebryanski.zendesk.com/embeddable/config`)
    .then(config => {
      if (!localeFetched) {
        global.fetchLocale(config.locale ?? 'en-US').catch(() => {})
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
