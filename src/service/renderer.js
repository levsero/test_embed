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

let initialised = false

const dummyStore = {
  dispatch: () => {},
  subscribe: () => {},
  getState: () => {}
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

function init(config, reduxStore = dummyStore) {
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
      webWidgetApp.render({ reduxStore, config })
    }

    reduxStore.dispatch(widgetInitialised())

    initialised = true
  }
}

function initIPM(config, embeddableConfig, reduxStore = dummyStore) {
  reduxStore.dispatch(updateEmbedAccessible('ipmWidget', true))
}

export const renderer = {
  init: init,
  initIPM: initIPM
}
