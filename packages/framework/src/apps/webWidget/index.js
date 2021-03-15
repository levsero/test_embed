import _ from 'lodash'

import { i18n } from 'src/apps/webWidget/services/i18n'
import { settings } from 'service/settings'
import {
  updateEmbedAccessible,
  updateEmbeddableConfig,
  widgetInitialised,
} from 'src/redux/modules/base'
import { setUpChat } from 'src/redux/modules/chat'
import { pollTalkStatus } from 'src/redux/modules/talk'
import { setUpHelpCenterAuth } from 'embeds/helpCenter/actions'
import { setLocaleApi } from 'service/api/apis'
import webWidgetApp from 'embeds/webWidget'
import publicApi from 'src/framework/services/publicApi'
import errorTracker from 'src/framework/services/errorTracker'
import { getWebWidgetPublicApi } from './public-api/setupApi'
import { getWebWidgetLegacyPublicApi } from './public-api/setupLegacyApi'
import { GA } from 'service/analytics/googleAnalytics'
import zopimApi from 'service/api/zopimApi'
import { win } from 'utility/globals'
import { beacon } from 'service/beacon'
import { http } from 'service/transport'
import createStore from 'src/redux/createStore'
import { clickBusterHandler, isMobileBrowser } from 'utility/devices'
import { store } from 'src/framework/services/persistence'

let initialised = false
let hasRendered = false

const dummyStore = {
  dispatch: () => {},
  getState: () => {},
  subscribe: () => {},
}

const filterEmbeds = (config) => {
  const features = _.get(document.zendesk, 'web_widget.features')

  // If there are no features available to read, do not do filtering
  if (!features) return config
  // If talk feature isn't available, act as if talk isn't in the config
  if (!_.includes(features, 'talk') && _.has(config.embeds, 'talk')) delete config.embeds.talk
  // If chat feature isn't available, act as if chat isn't in the config
  if (!_.includes(features, 'chat') && _.has(config.embeds, 'chat')) {
    delete config.embeds.chat
  }

  return config
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
  Object.keys(config.embeds).forEach((embed) => {
    reduxStore.dispatch(updateEmbedAccessible(embed, true))
  })
}

async function init({ config }) {
  if (initialised) {
    return
  }

  initialised = true

  const reduxStore = createStore()

  const filteredConfig = filterEmbeds(config)

  settings.init(reduxStore)
  GA.init()
  zopimApi.setupZopimQueue(win)
  if (win.zE !== win.zEmbed) {
    beacon.trackUserAction('zEmbedFallback', 'warning')
  }

  if (_.get(filteredConfig, 'embeds.chat')) {
    zopimApi.setUpZopimApiMethods(win, reduxStore)
  }

  if (config.hostMapping) {
    http.updateConfig({ hostMapping: config.hostMapping })
  }

  reduxStore.dispatch(updateEmbeddableConfig(config))

  // We need to use arturo in reducers for new reset behaviour for chat rating. We will
  // remove the `arturos` once the feature is stable, refer to https://zendesk.atlassian.net/browse/POLO-2135
  const webWidgetEnableLastChatRating = _.get(
    config,
    'embeds.chat.props.webWidgetEnableLastChatRating'
  )
  const arturos = {
    webWidgetEnableLastChatRating,
  }
  store.set('arturos', arturos)

  if (win.zESettings) {
    beacon.trackSettings(settings.getTrackSettings())
  }

  if (isMobileBrowser()) {
    win.addEventListener('click', clickBusterHandler, true)
  }

  i18n.init(reduxStore)
  await new Promise((res) => {
    i18n.setLocale(undefined, res, config.locale)
  })

  publicApi.registerApi(getWebWidgetPublicApi(reduxStore))
  publicApi.registerLegacyApi(getWebWidgetLegacyPublicApi(reduxStore, filteredConfig))

  errorTracker.configure({ enabled: settings.getErrorReportingEnabled() })

  if (_.isEmpty(filteredConfig.embeds)) return

  if (config.webWidgetCustomizations) {
    settings.enableCustomizations()
  }

  if (!i18n.getLocale()) {
    setLocaleApi(reduxStore, config.locale)
  }

  return {
    reduxStore,
    filteredConfig,
  }
}

function run({ config, embeddableData }) {
  if (hasRendered || !embeddableData) {
    return
  }

  hasRendered = true

  const { reduxStore, filteredConfig } = embeddableData

  if (_.isEmpty(filteredConfig.embeds)) {
    return
  }

  registerEmbedsInRedux(filteredConfig, reduxStore)
  setUpEmbeds(filteredConfig.embeds, reduxStore)

  reduxStore.dispatch(widgetInitialised())

  webWidgetApp.render({ reduxStore, config })
}

function initIPM(config, embeddableConfig, reduxStore = dummyStore) {
  reduxStore.dispatch(updateEmbedAccessible('ipmWidget', true))
}

export default {
  run,
  init: init,
  initIPM: initIPM,
}
