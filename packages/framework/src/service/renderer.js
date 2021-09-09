import _ from 'lodash'
import { i18n } from 'src/apps/webWidget/services/i18n'
import { setUpHelpCenterAuth } from 'src/embeds/helpCenter/actions'
import { pollTalkStatus } from 'src/embeds/talk/actions'
import webWidgetApp from 'src/embeds/webWidget'
import errorTracker from 'src/framework/services/errorTracker'
import { updateEmbedAccessible, widgetInitialised } from 'src/redux/modules/base'
import { setUpChat } from 'src/redux/modules/chat'
import { setLocaleApi } from 'src/service/api/apis'
import { settings } from 'src/service/settings'

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
