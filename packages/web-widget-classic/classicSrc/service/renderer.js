import { i18n } from 'classicSrc/app/webWidget/services/i18n'
import { setUpHelpCenterAuth } from 'classicSrc/embeds/helpCenter/actions'
import { pollTalkStatus } from 'classicSrc/embeds/talk/actions'
import webWidgetApp from 'classicSrc/embeds/webWidget'
import { updateEmbedAccessible, widgetInitialised } from 'classicSrc/redux/modules/base'
import { setUpChat } from 'classicSrc/redux/modules/chat'
import { setLocaleApi } from 'classicSrc/service/api/apis'
import { settings } from 'classicSrc/service/settings'
import _ from 'lodash'
import { errorTracker } from '@zendesk/widget-shared-services'

let initialised = false
let hasRendered = false

const dummyStore = {
  dispatch: () => {},
  getState: () => {},
  subscribe: () => {},
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

function init({ config = {}, reduxStore = dummyStore }) {
  if (initialised) {
    return
  }

  initialised = true

  errorTracker.configure({ enabled: settings.getErrorReportingEnabled() })

  if (_.isEmpty(config.embeds)) return

  if (config.webWidgetCustomizations) {
    settings.enableCustomizations()
  }

  if (!i18n.getLocale()) {
    setLocaleApi(reduxStore, config.locale)
  }
}

async function run({ config, reduxStore = dummyStore }) {
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

export const renderer = {
  run,
  init: init,
  initIPM: initIPM,
}
