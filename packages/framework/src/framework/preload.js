import 'core-js/modules/es.promise'
import 'core-js/modules/es.array.iterator'
import 'core-js/modules/es.object.assign'
import fetchLocale from 'src/framework/services/i18n/fetchLocale'
import { prefetchChatStatus } from 'src/embeds/chat/apis/deferred-chat-api'

global.__ZENDESK_CLIENT_I18N_GLOBAL = 'WW_I18N'

let localeFetched = false

if (document.zEQueue) {
  for (let i = 0; i < document.zEQueue.length; i++) {
    const args = document.zEQueue[i]
    if (args[1] === 'setLocale' && args[2]) {
      fetchLocale(args[2]).catch(() => {})
      localeFetched = true
    }
  }
}

if (window.ACFetch) {
  global.configRequest = window
    .ACFetch(`https://${window.document.zendesk.web_widget.id}/embeddable/config`)
    .then((config) => {
      if (!localeFetched) {
        fetchLocale(config.locale ?? 'en-US').catch(() => {})
      }

      if (window.top?.zESettings?.webWidget?.chat?.connectOnPageLoad === false) {
        if (config?.embeds?.chat?.props?.mediatorHost && config?.embeds?.chat?.props?.zopimId) {
          prefetchChatStatus(
            config.embeds.chat.props.mediatorHost,
            config.embeds.chat.props.zopimId
          )
        }
      }

      return {
        success: true,
        config,
      }
    })
    .catch(() => ({
      success: false,
    }))
}

import(/* webpackChunkName: "framework" */ './index').then((res) => {
  return res.default.start()
})
