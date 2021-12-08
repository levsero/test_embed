import { getWebWidgetPublicApi } from 'classicSrc/app/webWidget/public-api/setupApi'
import { getWebWidgetLegacyPublicApi } from 'classicSrc/app/webWidget/public-api/setupLegacyApi'
import { i18n } from 'classicSrc/app/webWidget/services/i18n'
import verifyDepartmentsSettingUsage from 'classicSrc/embeds/chat/utils/verifyDepartmentsSettingUsage'
import { setUpHelpCenterAuth } from 'classicSrc/embeds/helpCenter/actions'
import { pollTalkStatus } from 'classicSrc/embeds/talk/actions'
import webWidgetApp from 'classicSrc/embeds/webWidget'
import createStore from 'classicSrc/redux/createStore'
import {
  updateEmbedAccessible,
  updateEmbeddableConfig,
  widgetInitialised,
} from 'classicSrc/redux/modules/base'
import { setUpChat } from 'classicSrc/redux/modules/chat'
import { GA } from 'classicSrc/service/analytics/googleAnalytics'
import { setLocaleApi } from 'classicSrc/service/api/apis'
import zopimApi from 'classicSrc/service/api/zopimApi'
import { settings } from 'classicSrc/service/settings'
import { http } from 'classicSrc/service/transport'
import _ from 'lodash'
import {
  beacon,
  clickBusterHandler,
  errorTracker,
  isMobileBrowser,
  publicApi,
  win,
} from '@zendesk/widget-shared-services'

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
    verifyDepartmentsSettingUsage(reduxStore)
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

export { init, run, initIPM }
