import _ from 'lodash'

import { i18n } from 'service/i18n'
import { settings } from 'service/settings'
import { updateEmbedAccessible, widgetInitialised } from 'src/redux/modules/base'
import { setUpChat } from 'src/redux/modules/chat'
import { pollTalkStatus } from 'src/redux/modules/talk'
import { setUpHelpCenterAuth } from 'embeds/helpCenter/actions'
import { setLocaleApi } from 'service/api/apis'
import webWidgetApp from 'embeds/webWidget'
import publicApi from 'src/framework/services/publicApi'
import errorTracker from 'src/framework/services/errorTracker'
import { getWebWidgetPublicApi } from './public-api/setupApi'
import { getWebWidgetLegacyPublicApi } from './public-api/setupLegacyApi'

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
    reduxStore.dispatch(pollTalkStatus())
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

function init({ config, reduxStore = dummyStore }) {
  if (initialised) {
    return
  }

  initialised = true

  publicApi.registerApi(getWebWidgetPublicApi(reduxStore))
  publicApi.registerLegacyApi(getWebWidgetLegacyPublicApi(reduxStore, config))

  errorTracker.configure({ enabled: settings.getErrorReportingEnabled() })

  if (_.isEmpty(config.embeds)) return

  if (config.webWidgetCustomizations) {
    settings.enableCustomizations()
  }

  if (!i18n.getLocale()) {
    setLocaleApi(reduxStore, config.locale)
  }
}

function run({ config, reduxStore = dummyStore }) {
  if (hasRendered) {
    return
  }

  hasRendered = true

  if (_.isEmpty(config.embeds)) {
    return
  }

  registerEmbedsInRedux(config, reduxStore)
  setUpEmbeds(config.embeds, reduxStore)

  reduxStore.dispatch(widgetInitialised())

  webWidgetApp.render({ reduxStore, config })
}

function initIPM(config, embeddableConfig, reduxStore = dummyStore) {
  reduxStore.dispatch(updateEmbedAccessible('ipmWidget', true))
}

export default {
  run,
  init: init,
  initIPM: initIPM
}
