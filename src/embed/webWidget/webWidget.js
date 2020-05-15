import React from 'react'
import ReactDOM from 'react-dom'
import _ from 'lodash'
import { Provider } from 'react-redux'

import { webWidgetStyles } from './webWidgetStyles'
import Frame from 'component/frame/Frame'
import { i18n } from 'service/i18n'
import { settings } from 'service/settings'
import { generateUserWidgetCSS } from 'utility/color/styles'
import { isMobileBrowser } from 'utility/devices'
import { document, getDocumentHost, isPopout } from 'utility/globals'
import { getChatConnectionSuppressed } from 'src/redux/modules/selectors'
import {
  getSettingsHelpCenterSuppress,
  getCookiesDisabled
} from 'src/redux/modules/settings/settings-selectors'
import WebWidget from 'component/webWidget/WebWidget'
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
    const chatAvailable =
      !!embeds.chat && !getChatConnectionSuppressed(state) && !getCookiesDisabled(state)

    const chatConfig = chatAvailable ? embeds.chat.props : {}

    // if HC is unavailable, then IPM help center is available
    const ipmHelpCenterAvailable = !helpCenterAvailable

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
      store: reduxStore
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

  const webWidget = {
    create,
    render,
    get,
    waitForRootComponent
  }

  return webWidget
}
