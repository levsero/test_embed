import React from 'react'
import ReactDOM from 'react-dom'
import _ from 'lodash'
import { Provider } from 'react-redux'

import { webWidgetStyles } from './webWidgetStyles'
import Frame from 'component/frame/Frame'
import { beacon } from 'service/beacon'
import { i18n } from 'service/i18n'
import { mediator } from 'service/mediator'
import { settings } from 'service/settings'
import { http } from 'service/transport'
import { generateUserWidgetCSS } from 'utility/color/styles'
import { isIE, isMobileBrowser } from 'utility/devices'
import { document, getDocumentHost, isPopout } from 'utility/globals'
import { isOnHelpCenterPage } from 'utility/pages'
import {
  getChatNotification,
  getChatConnectionSuppressed,
  getTalkNickname,
  getTalkEnabled
} from 'src/redux/modules/selectors'
import { getStandaloneMobileNotificationVisible } from 'src/redux/modules/chat/chat-selectors'
import { setVisitorInfo, chatNotificationDismissed, setUpChat } from 'src/redux/modules/chat'
import {
  getSettingsHelpCenterSuppress,
  getSettingsContactFormSuppress,
  getCookiesDisabled
} from 'src/redux/modules/settings/settings-selectors'
import { getTicketForms, getTicketFields } from 'src/redux/modules/submitTicket'
import { authenticate, expireToken } from 'src/redux/modules/base'
import WebWidget from 'component/webWidget/WebWidget'
import { loadTalkVendors } from 'src/redux/modules/talk'
import { setScrollKiller } from 'utility/scrollHacks'
import { nameValid, emailValid, onNextTick } from 'src/util/utils'

const webWidgetCSS = `${require('globalCSS')} ${webWidgetStyles}`

export default function WebWidgetFactory(name) {
  let embed = null
  let prefix = ''

  if (name) {
    prefix = name + '.'
  }

  const onShow = () => {
    getWebWidgetComponent().show()
  }
  const onHide = () => {
    const rootComponent = getActiveComponent()

    if (rootComponent) {
      if (rootComponent.pauseAllVideos) {
        rootComponent.pauseAllVideos()
      }
    }
  }
  const onBack = () => {
    getWebWidgetComponent().onBackClick()
  }
  const afterShowAnimate = () => {
    const rootComponent = getActiveComponent()

    if (rootComponent && isIE()) {
      if (rootComponent.refs.submitTicketForm) {
        rootComponent.refs.submitTicketForm.focusField()
      }
    }
    if (rootComponent && rootComponent.focusField) {
      rootComponent.focusField()
    }
  }
  const zopimOnNext = () => {
    mediator.channel.broadcast(prefix + 'helpCenterForm.onNextClick')
    hide()
    if (isMobileBrowser()) {
      setScrollKiller(false)
    }
  }

  function create(name, config, reduxStore) {
    let containerStyle
    let frameBodyCss = ''
    const popout = isPopout(),
      isMobile = isMobileBrowser()
    const state = reduxStore.getState()

    const configDefaults = {
      hideZendeskLogo: false,
      color: '#1F73B7'
    }
    const talkConfig = config.talk
    const helpCenterAvailable = !!config.helpCenterForm && !getSettingsHelpCenterSuppress(state)
    const talkEnabled = getTalkEnabled(state)
    const submitTicketAvailable =
      !!config.ticketSubmissionForm && !getSettingsContactFormSuppress(state)
    const chatConfig = config.zopimChat
    const chatAvailable =
      !!chatConfig && !getChatConnectionSuppressed(state) && !getCookiesDisabled(state)
    const submitTicketSettings = submitTicketAvailable
      ? setUpSubmitTicket(config.ticketSubmissionForm, reduxStore)
      : {}
    const helpCenterSettings = setUpHelpCenter(config.helpCenterForm)
    // if HC is unavailable, then IPM help center is available
    const ipmHelpCenterAvailable = !helpCenterAvailable
    const rootConfig = _.omit(config, [
      'ticketSubmissionForm',
      'helpCenterForm',
      'zopimChat',
      'talk'
    ])
    const globalConfig = _.extend(
      configDefaults,
      helpCenterSettings.config,
      submitTicketSettings.config,
      talkConfig,
      chatConfig,
      rootConfig
    )

    embed = {
      submitTicketSettings,
      config: {
        global: globalConfig,
        helpCenterForm: helpCenterSettings.config,
        ticketSubmissionForm: submitTicketSettings.config,
        zopimChat: chatConfig
      },
      embedsAvailable: { chat: chatAvailable },
      store: reduxStore
    }

    if (chatAvailable) {
      reduxStore.dispatch(setUpChat())
    }

    if (talkEnabled) {
      setupTalk(talkConfig, reduxStore)
    }

    if (isMobile || popout) {
      containerStyle = { width: '100%', minHeight: '100%', maxHeight: '100%' }

      if (!isMobile) {
        containerStyle = {
          ...containerStyle,
          maxWidth: '650px',
          height: '100%'
        }
      }
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
      position: globalConfig.position,
      fullscreenable: true,
      fullscreen: popout,
      isMobile: isMobile,
      newChat: chatAvailable,
      store: reduxStore,
      visible: false,
      useBackButton: !popout,
      hideNavigationButtons: popout && isMobile,
      onShow,
      name: name,
      afterShowAnimate,
      onHide,
      onBack,
      title: i18n.t('embeddable_framework.web_widget.frame.title')
    }

    const component = (
      <Provider store={reduxStore}>
        <Frame {...frameParams}>
          <WebWidget
            attachmentSender={submitTicketSettings.attachmentSender}
            fullscreen={popout}
            isMobile={isMobile}
            ipmHelpCenterAvailable={ipmHelpCenterAvailable}
            isOnHelpCenterPage={isOnHelpCenterPage()}
            imagesSender={helpCenterSettings.imagesSenderFn}
            onSubmitted={submitTicketSettings.onSubmitted}
            originalArticleButton={settings.get('helpCenter.originalArticleButton')}
            position={globalConfig.position}
            style={containerStyle}
            ticketFormSettings={settings.get('contactForm.ticketForms')}
            ticketFieldSettings={settings.get('contactForm.fields')}
            submitTicketConfig={submitTicketSettings.config}
            talkConfig={talkConfig}
            zopimOnNext={zopimOnNext}
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

    setupMediator()
  }

  function hide(options) {
    waitForRootComponent(() => {
      embed.instance.hide(options)
    })
  }

  function setupMediator() {
    mediator.channel.subscribe(prefix + 'webWidget.proactiveChat', (options = {}) => {
      embed.instance.show(options)
      getWebWidgetComponent().showProactiveChat()
    })

    mediator.channel.subscribe(prefix + 'webWidget.clearAttachments', () => {
      const webWidgetComponent = getWebWidgetComponent()

      if (webWidgetComponent) {
        const submitTicket = webWidgetComponent.getSubmitTicketComponent()

        if (submitTicket) {
          submitTicket.clearAttachments()
        }
      }
    })

    mediator.channel.subscribe(prefix + 'webWidget.hideChatNotification', () => {
      const state = embed.store.getState()
      const { show } = getChatNotification(state)

      if (getStandaloneMobileNotificationVisible(state)) {
        getWebWidgetComponent().dismissStandaloneChatPopup()
      } else if (show) {
        embed.store.dispatch(chatNotificationDismissed())
      }
    })

    mediator.channel.subscribe(prefix + 'webWidget.zopimChatStarted', () => {
      waitForRootComponent(() => {
        if (!embed.instance.props.visible) {
          getWebWidgetComponent().setComponent('zopimChat')
        }
      })
    })

    mediator.channel.subscribe(prefix + 'webWidget.updateSettings', () => {
      waitForRootComponent(() => {
        embed.instance.forceUpdateWorld()
      })
    })

    mediator.channel.subscribe(prefix + 'webWidget.refreshLocale', () => {
      waitForRootComponent(() => {
        const store = embed.store
        const { ticketForms, customFields = {} } = embed.submitTicketSettings

        embed.instance.updateFrameLocale()
        getWebWidgetComponent().forceUpdate()
        if (getActiveComponent()) {
          getActiveComponent().forceUpdate()
        }

        if (!_.isEmpty(ticketForms)) {
          store.dispatch(getTicketForms(ticketForms, i18n.getLocale()))
        } else if (customFields.ids || customFields.all) {
          store.dispatch(getTicketFields(customFields, i18n.getLocale()))
        }

        embed.instance.getChild().forceUpdate()
      })
    })

    mediator.channel.subscribe(prefix + 'zopimChat.setUser', user => {
      waitForRootComponent(() => {
        if (embed.embedsAvailable.chat) {
          // Fallback to null or empty string because Chat SDK doesn't accept "undefined" or "null"
          const validUser = {}

          if (nameValid(user.name)) validUser.display_name = user.name // eslint-disable-line camelcase
          if (emailValid(user.email)) validUser.email = user.email

          embed.store.dispatch(setVisitorInfo(validUser))
        }
      })
    })
  }

  function get() {
    return embed
  }

  function getActiveComponent() {
    return getWebWidgetComponent().getActiveComponent()
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

  function setUpSubmitTicket(config, store) {
    const submitTicketConfigDefaults = {
      position: 'right',
      customFields: {},
      formTitleKey: 'message',
      attachmentsEnabled: false,
      maxFileCount: 5,
      maxFileSize: 5 * 1024 * 1024, // 5 MB
      ticketForms: [],
      color: '#1F73B7'
    }

    config = _.extend({}, submitTicketConfigDefaults, config)

    const attachmentSender = (file, doneFn, failFn, progressFn) => {
      const payload = {
        method: 'post',
        path: '/api/v2/uploads',
        file: file,
        callbacks: {
          done: doneFn,
          fail: failFn,
          progress: progressFn
        }
      }

      return http.sendFile(payload)
    }
    const createUserActionPayload = (payload, params) => {
      const body = params.res.body
      const response = body.request || body.suspended_ticket

      return _.extend({}, payload, {
        ticketId: response.id,
        email: params.email,
        attachmentsCount: params.attachmentsCount,
        attachmentTypes: params.attachmentTypes,
        contextualSearch: params.contextualSearch
      })
    }
    const onSubmitted = params => {
      let userActionPayload = {
        query: params.searchTerm,
        locale: params.searchLocale
      }

      userActionPayload = createUserActionPayload(userActionPayload, params)
      beacon.trackUserAction('submitTicket', 'send', {
        label: 'ticketSubmissionForm',
        value: userActionPayload
      })
      mediator.channel.broadcast(prefix + 'ticketSubmissionForm.onFormSubmitted')
    }
    const getTicketFormsFromConfig = _.memoize(config => {
      const settingTicketForms = settings.get('contactForm.ticketForms')

      if (_.isEmpty(settingTicketForms)) {
        return config.ticketForms
      }

      return _.reduce(
        settingTicketForms,
        (result, ticketForm) => {
          const id = _.get(ticketForm, 'id')

          if (id) {
            result.push(id)
          }

          return result
        },
        []
      )
    })

    const { customFields } = config
    const ticketForms = getTicketFormsFromConfig(config)

    if (!_.isEmpty(ticketForms)) {
      // TODO: Alter this code to return objects with id's once pre-fill is GA'd
      store.dispatch(getTicketForms(ticketForms, i18n.getLocale()))
    } else if (customFields.ids || customFields.all === true) {
      store.dispatch(getTicketFields(customFields, i18n.getLocale()))
      config.customFields = {}
    }

    return {
      config,
      ticketForms,
      customFields,
      attachmentSender,
      onSubmitted
    }
  }

  function setupTalk(config, store) {
    store.dispatch(
      loadTalkVendors(
        [import('socket.io-client'), import('libphonenumber-js')],
        config.serviceUrl,
        getTalkNickname(store.getState())
      )
    )
  }

  function setUpHelpCenter(config) {
    return {
      config
    }
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
