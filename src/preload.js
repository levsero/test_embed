import 'core-js/modules/es6.promise'
import 'core-js/modules/es6.array.iterator'

if (window.ACFetch) {
  global.configRequest = window
    .ACFetch(`https://${window.document.zendesk.web_widget.id}/embeddable/config`)
    .then(config => {
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
