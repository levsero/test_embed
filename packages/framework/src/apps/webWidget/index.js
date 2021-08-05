import _ from 'lodash'
import { i18n } from 'src/apps/webWidget/services/i18n'
import { setUpHelpCenterAuth } from 'src/embeds/helpCenter/actions'
import { pollTalkStatus } from 'src/embeds/talk/actions'
import webWidgetApp from 'src/embeds/webWidget'
import errorTracker from 'src/framework/services/errorTracker'
import publicApi from 'src/framework/services/publicApi'
import createStore from 'src/redux/createStore'
import {
  updateEmbedAccessible,
  updateEmbeddableConfig,
  widgetInitialised,
} from 'src/redux/modules/base'
import { setUpChat } from 'src/redux/modules/chat'
import { GA } from 'src/service/analytics/googleAnalytics'
import { setLocaleApi } from 'src/service/api/apis'
import zopimApi from 'src/service/api/zopimApi'
import { beacon } from 'src/service/beacon'
import { settings } from 'src/service/settings'
import { http } from 'src/service/transport'
import { clickBusterHandler, isMobileBrowser } from 'src/util/devices'
import { win } from 'src/util/globals'
import { getWebWidgetPublicApi } from './public-api/setupApi'
import { getWebWidgetLegacyPublicApi } from './public-api/setupLegacyApi'

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
