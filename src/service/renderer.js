import _ from 'lodash'

import { i18n } from 'service/i18n'
import { settings } from 'service/settings'
import { updateEmbedAccessible, widgetInitialised } from 'src/redux/modules/base'
import { setUpChat } from 'src/redux/modules/chat'
import { loadTalkVendors, pollTalkStatus } from 'src/redux/modules/talk'
import { setUpHelpCenterAuth } from 'src/embeds/helpCenter/actions'
import { setLocaleApi } from 'src/service/api/apis'
import webWidgetApp from 'src/embeds/webWidget'
import isFeatureEnabled from 'src/embeds/webWidget/selectors/feature-flags'
import { getIsWidgetReady } from 'src/redux/modules/selectors'
import publicApi from 'src/framework/services/publicApi'
import { getWebWidgetPublicApi } from 'service/api/webWidgetApi/setupApi'
import { getWebWidgetLegacyPublicApi } from 'service/api/webWidgetApi/setupLegacyApi'
import logger from 'src/util/logger'

let initialised = false
let hasRendered = false

const dummyStore = {
  dispatch: () => {},
  getState: () => {},
  subscribe: () => {}
}

function setUpEmbeds(embeds, reduxStore) {
  if (embeds.chat) {
    reduxStore.dispatch(setUpChat(true))
  }

  if (embeds.talk) {
    if (isFeatureEnabled(reduxStore.getState(), 'defer_talk_connection')) {
      reduxStore.dispatch(pollTalkStatus())
    } else {
      reduxStore.dispatch(loadTalkVendors())
    }
  }

  if (embeds.helpCenterForm) {
    reduxStore.dispatch(setUpHelpCenterAuth())
  }
}

function registerEmbedsInRedux(config, reduxStore) {
  Object.keys(config.embeds).forEach(embed => {
    reduxStore.dispatch(updateEmbedAccessible(embed, true))
  })
}

async function init(config, reduxStore = dummyStore) {
  publicApi.registerApi(getWebWidgetPublicApi(reduxStore))
  publicApi.registerLegacyApi(getWebWidgetLegacyPublicApi(reduxStore, config))

  if (_.isEmpty(config.embeds)) return
  if (!initialised) {
    if (config.webWidgetCustomizations) {
      settings.enableCustomizations()
    }

    if (!i18n.getLocale()) {
      setLocaleApi(reduxStore, config.locale)
    }

    if (!_.isEmpty(config.embeds)) {
      registerEmbedsInRedux(config, reduxStore)
      setUpEmbeds(config.embeds, reduxStore)
    }

    reduxStore.dispatch(widgetInitialised())

    // Wait for the widget to be ready
    try {
      await new Promise(resolve => {
        const unsubscribe = reduxStore.subscribe(() => {
          if (getIsWidgetReady(reduxStore.getState())) {
            resolve()
            unsubscribe()
          }
        })

        if (getIsWidgetReady(reduxStore.getState())) {
          resolve()
          unsubscribe()
        }
      })
    } catch (err) {
      logger.error('Failed while waiting for web widget to initialise', err)
      return
    }

    initialised = true
  }
}

function run(config, reduxStore = dummyStore) {
  if (hasRendered) {
    return
  }

  if (!_.isEmpty(config.embeds)) {
    webWidgetApp.render({ reduxStore, config })
  }
  hasRendered = true
}

function initIPM(config, embeddableConfig, reduxStore = dummyStore) {
  reduxStore.dispatch(updateEmbedAccessible('ipmWidget', true))
}

export const renderer = {
  run,
  init: init,
  initIPM: initIPM
}
