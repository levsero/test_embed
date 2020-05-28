import _ from 'lodash'

import { launcher } from 'embed/launcher/launcher'
import WebWidgetFactory from 'embed/webWidget/webWidget'
import { i18n } from 'service/i18n'
import { settings } from 'service/settings'
import { win } from 'utility/globals'
import { updateEmbedAccessible, widgetInitialised } from 'src/redux/modules/base'
import { setUpChat } from 'src/redux/modules/chat'
import { pollTalkStatus } from 'src/redux/modules/talk'
import { setUpHelpCenterAuth } from 'src/embeds/helpCenter/actions'
import { FONT_SIZE } from 'constants/shared'
import { setLocaleApi } from 'src/service/api/apis'

const embedsMap = {
  launcher: launcher,
  webWidget: new WebWidgetFactory(),
  ipmWidget: new WebWidgetFactory('ipm')
}
let initialised = false
let hideLauncher = false

function hide() {
  hideLauncher = true
}

const dummyStore = {
  dispatch: () => {}
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

function renderWebWidget(config, reduxStore) {
  const webWidget = embedsMap['webWidget']

  webWidget.create('webWidget', _.omit(config, 'embeds.launcher'), reduxStore)
  webWidget.render('webWidget')
}

function renderLauncher(config, reduxStore) {
  const visible = config.embeds && !config.embeds.talk && !config.embeds.chat && !hideLauncher

  const parsedConfig = {
    ...config.embeds.launcher,
    visible
  }

  launcher.create('launcher', parsedConfig, reduxStore)
  launcher.render('launcher')
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
      renderLauncher(config, reduxStore)
      renderWebWidget(config, reduxStore)
    }

    reduxStore.dispatch(widgetInitialised())

    initialised = true

    if (Math.abs(win.orientation) === 90) {
      hideByZoom(true)
    }
  }
}

function initIPM(config, embeddableConfig = { embeds: {} }, reduxStore = dummyStore) {
  const ipmWidget = embedsMap['ipmWidget']

  const parsedConfig = {
    embeds: {
      ...embeddableConfig.embeds,
      ...config.embeds
    }
  }

  ipmWidget.create('ipmWidget', parsedConfig, reduxStore)
  ipmWidget.render('ipmWidget')

  reduxStore.dispatch(updateEmbedAccessible('ipmWidget', true))
}

function renderedEmbedsApply(fn) {
  ;['webWidget', 'launcher', 'ipmWidget'].forEach(function(name) {
    const currentEmbed = embedsMap[name].get()

    if (currentEmbed && currentEmbed.instance) {
      fn(currentEmbed.instance)
    }
  })
}

function propagateFontRatio(ratio) {
  const fontSize = FONT_SIZE * ratio.toFixed(2) + 'px'

  renderedEmbedsApply(embed => {
    embed.updateBaseFontSize(fontSize)
  })
}

function hideByZoom(hide) {
  renderedEmbedsApply(embed => {
    embed.setHiddenByZoom(hide)
  })
}

export const renderer = {
  init: init,
  initIPM: initIPM,
  propagateFontRatio: propagateFontRatio,
  hideByZoom: hideByZoom,
  hide: hide
}
