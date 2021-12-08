import { JWT_ERROR } from 'classicSrc/constants/chat'
import { deferChatSetup, beginChatSetup } from 'classicSrc/embeds/chat/actions/setup-chat'
import {
  getChatConfig,
  getBrandCount,
  getBrand,
} from 'classicSrc/redux/modules/base/base-selectors'
import {
  fetchConversationHistory,
  handleChatVendorLoaded,
  chatConnectionError,
} from 'classicSrc/redux/modules/chat'
import { chatBanned } from 'classicSrc/redux/modules/chat'
import {
  AUTHENTICATION_STARTED,
  AUTHENTICATION_FAILED,
} from 'classicSrc/redux/modules/chat/chat-action-types'
import firehoseListener from 'classicSrc/redux/modules/chat/helpers/firehoseListener'
import {
  getChatConnectionSuppressed,
  getDelayChatConnection,
} from 'classicSrc/redux/modules/selectors'
import { getCookiesDisabled } from 'classicSrc/redux/modules/settings/settings-selectors'
import zopimApi from 'classicSrc/service/api/zopimApi'
import { settings } from 'classicSrc/service/settings'
import { cleanBrandName } from 'classicSrc/util/chat'
import _ from 'lodash'
import { errorTracker } from '@zendesk/widget-shared-services'
import { persistence as store } from '@zendesk/widget-shared-services'
import { win, isPopout } from '@zendesk/widget-shared-services'
import loadZChat from './loadZChat'

function makeChatConfig(config) {
  const jwtFn = _.get(config, 'authentication.jwtFn')
  const authentication = jwtFn ? { jwt_fn: jwtFn } : null

  return _.omitBy(
    {
      account_key: store.get('chatAccountKey') || config.zopimId,
      override_proxy: store.get('chatOverrideProxy') || config.overrideProxy,
      override_auth_server_host:
        store.get('chatOverrideAuthServerHost') || config.overrideAuthServerHost,
      authentication,
      activity_window: win,
      popout: isPopout(),
      suppress_console_error: true,
    },
    _.isNil
  )
}

export function setUpChat(canBeDeferred = true, chatReadyCallback) {
  return (dispatch, getState) => {
    if (getChatConnectionSuppressed(getState()) || getCookiesDisabled(getState())) {
      return
    }

    if (canBeDeferred && getDelayChatConnection(getState())) {
      dispatch(deferChatSetup())
      return
    }

    dispatch(beginChatSetup())

    zopimApi.handleZopimQueue(win)

    const authentication = settings.getChatAuthSettings()
    const state = getState()

    const config = {
      ...getChatConfig(state).props,
      authentication,
    }

    const brandCount = getBrandCount(state)
    const brand = getBrand(state)
    let brandName

    if (brandCount === undefined || brandCount > 1) {
      brandName = cleanBrandName(brand)
    }

    const onChatImported = (zChat, slider) => {
      zChat = loadZChat(zChat)
      dispatch(
        handleChatVendorLoaded({
          zChat,
          slider: slider.default,
        })
      )

      zChat.on('error', (error) => {
        // eslint-disable-next-line no-console
        console.warn(error.message)

        if (error.message.includes('Visitor has been banned')) {
          dispatch(chatBanned())
        }
      })

      if (config.authentication) {
        const onAuthFailure = (e) => {
          if (_.get(e, 'extra.reason') === JWT_ERROR) {
            _.unset(config, 'authentication')
            dispatch({
              type: AUTHENTICATION_FAILED,
            })

            zChat.init(makeChatConfig(config))
            if (brandName) zChat.addTag(brandName)
          } else {
            dispatch(chatConnectionError())
          }
        }

        zChat.on('error', onAuthFailure)

        dispatch({
          type: AUTHENTICATION_STARTED,
        })
      }
      zChat.init(makeChatConfig(config))

      zChat.setOnFirstReady({
        fetchHistory: () => {
          if (_.get(config, 'authentication.jwtFn')) {
            dispatch(fetchConversationHistory())
          }
        },
        // Generic ready function, will fire once zChat is ready.
        // Can be used for setup that requires zChat to be ready and connected
        ready: () => {
          if (brandName) zChat.addTags([brandName])
          zopimApi.handleChatSDKInitialized()

          if (chatReadyCallback) {
            chatReadyCallback()
          }
        },
      })

      zChat.getFirehose().on('data', firehoseListener(zChat, dispatch, getState))
    }
    const onFailure = (err) => {
      errorTracker.error(err)
    }

    Promise.all([
      import(/* webpackChunkName: 'chat-sdk' */ 'chat-web-sdk'),
      import(/* webpackChunkName: 'chat-sdk' */ 'react-slick'),
    ])
      .then((arr) => onChatImported(...arr))
      .catch(onFailure)
  }
}
