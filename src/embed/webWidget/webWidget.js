import React from 'react'
import ReactDOM from 'react-dom'
import _ from 'lodash'
import { Provider } from 'react-redux'

import { webWidgetStyles } from './webWidgetStyles'
import Frame from 'component/frame/Frame'
import { beacon } from 'service/beacon'
import { i18n } from 'service/i18n'
import { settings } from 'service/settings'
import { generateUserWidgetCSS } from 'utility/color/styles'
import { isMobileBrowser } from 'utility/devices'
import { document, getDocumentHost, isPopout } from 'utility/globals'
import {
  getChatConnectionSuppressed,
  getTalkNickname,
  getTalkEnabled
} from 'src/redux/modules/selectors'
import { setUpChat } from 'src/redux/modules/chat'
import {
  getSettingsHelpCenterSuppress,
  getCookiesDisabled
} from 'src/redux/modules/settings/settings-selectors'
import { authenticate, expireToken } from 'src/redux/modules/base'
import WebWidget from 'component/webWidget/WebWidget'
import { loadTalkVendors } from 'src/redux/modules/talk'
import { onNextTick } from 'src/util/utils'

const webWidgetCSS = `${require('globalCSS')} ${webWidgetStyles}`

export default function WebWidgetFactory() {
  let embed = null

  const onBack = () => {
    getWebWidgetComponent().onBackClick()
  }

  function create(name, config, reduxStore) {
    let containerStyle
    let frameBodyCss = ''
    const popout = isPopout(),
      isMobile = isMobileBrowser()
    const state = reduxStore.getState()
    const { embeds } = config

    const helpCenterAvailable = !!embeds.helpCenterForm && !getSettingsHelpCenterSuppress(state)
    const talkEnabled = getTalkEnabled(state)
    const chatAvailable =
      !!embeds.chat && !getChatConnectionSuppressed(state) && !getCookiesDisabled(state)

    const talkConfig = talkEnabled ? embeds.talk.props : {}
    const chatConfig = chatAvailable ? embeds.chat.props : {}
    const helpCenterConfig = helpCenterAvailable ? embeds.helpCenterForm.props : {}

    // if HC is unavailable, then IPM help center is available
    const ipmHelpCenterAvailable = !helpCenterAvailable

    embed = {
      config: {
        helpCenterForm: helpCenterConfig,
        chat: chatConfig
      },
      store: reduxStore
    }

    if (embeds.chat) {
      reduxStore.dispatch(setUpChat(true))
    }

    if (talkEnabled) {
      setupTalk(talkConfig, reduxStore)
    }

    if (isMobile || popout) {
      containerStyle = { width: '100%', minHeight: '100%', maxHeight: '100%' }
    } else {
      containerStyle = { width: 342 }
      frameBodyCss = `
        body { padding: 0 7px; }
      `
    }

    const frameParams = {
      ref: el => {
        embed.instance = el
      },
      css: webWidgetCSS + frameBodyCss,
      generateUserCSS: generateUserWidgetCSS,
      fullscreenable: true,
      fullscreen: popout,
      isMobile: isMobile,
      store: reduxStore,
      visible: false,
      useBackButton: !popout,
      hideNavigationButtons: popout && isMobile,
      name: name,
      onBack,
      title: i18n.t('embeddable_framework.web_widget.frame.title')
    }

    const component = (
      <Provider store={reduxStore}>
        <Frame {...frameParams}>
          <WebWidget
            fullscreen={popout}
            isMobile={isMobile}
            ipmHelpCenterAvailable={ipmHelpCenterAvailable}
            style={containerStyle}
            ticketFormSettings={settings.get('contactForm.ticketForms')}
            ticketFieldSettings={settings.get('contactForm.fields')}
            chatId={_.get(chatConfig, 'zopimId')}
          />
        </Frame>
      </Provider>
    )

    embed = {
      component,
      ...embed
    }

    return this
  }

  function render() {
    if (embed && embed.instance) {
      throw new Error('WebWidget has already been rendered.')
    }

    const element = getDocumentHost().appendChild(document.createElement('div'))

    ReactDOM.render(embed.component, element)
  }

  function get() {
    return embed
  }

  function getWebWidgetComponent() {
    return embed.instance.getRootComponent()
  }

  function waitForRootComponent(callback) {
    if (embed && embed.instance && getWebWidgetComponent()) {
      callback()
    } else {
      onNextTick(() => {
        waitForRootComponent(callback)
      })
    }
  }

  function postRender() {
    if (!embed) return
    // Only send 1/10 times
    if (Math.random() <= 0.1) {
      beacon.sendWidgetInitInterval()
    }

    if (!embed.config.helpCenterForm) return

    const config = embed.config.helpCenterForm

    if (config.tokensRevokedAt) {
      embed.store.dispatch(expireToken(config.tokensRevokedAt))
    }

    const settingJwtFn = settings.getAuthSettingsJwtFn()

    if (settingJwtFn) {
      const callback = retrievedJwt => {
        embed.store.dispatch(authenticate(retrievedJwt))
      }

      return settingJwtFn(callback)
    }

    const settingJwt = settings.getAuthSettingsJwt()

    if (settingJwt) embed.store.dispatch(authenticate(settingJwt))
  }

  function setupTalk(config, store) {
    store.dispatch(
      loadTalkVendors(
        [import(/* webpackChunkName: 'talk-sdk' */ 'socket.io-client')],
        config.serviceUrl,
        getTalkNickname(store.getState())
      )
    )
  }

  const webWidget = {
    create,
    render,
    get,
    postRender,
    waitForRootComponent
  }

  return webWidget
}
