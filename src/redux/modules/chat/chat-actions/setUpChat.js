import _ from 'lodash'
import errorTracker from 'service/errorTracker'
import { store } from 'service/persistence'
import { settings } from 'service/settings'
import { getChatConfig, getBrandCount, getBrand } from 'src/redux/modules/base/base-selectors'
import {
  fetchConversationHistory,
  handleChatVendorLoaded,
  chatConnectionError
} from 'src/redux/modules/chat'
import { JWT_ERROR } from 'constants/chat'
import {
  AUTHENTICATION_STARTED,
  AUTHENTICATION_FAILED
} from 'src/redux/modules/chat/chat-action-types'
import zopimApi from 'service/api/zopimApi'
import { win, isPopout } from 'utility/globals'
import { cleanBrandName } from 'utility/chat'
import firehoseListener from 'src/redux/modules/chat/helpers/firehoseListener'
import { getChatConnectionSuppressed, getDelayChatConnection } from 'src/redux/modules/selectors'
import { getCookiesDisabled } from 'src/redux/modules/settings/settings-selectors'
import { deferChatSetup, beginChatSetup } from 'embeds/chat/actions/setup-chat'
import { chatBanned } from 'src/redux/modules/chat'

function makeChatConfig(config) {
  /* eslint-disable camelcase */
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
      suppress_console_error: true
    },
    _.isNil
  )
  /* eslint-enable camelcase */
}

export function setUpChat(canBeDeferred = true) {
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
      authentication
    }

    const brandCount = getBrandCount(state)
    const brand = getBrand(state)
    let brandName

    if (brandCount === undefined || brandCount > 1) {
      brandName = cleanBrandName(brand)
    }

    const onChatImported = (zChat, slider) => {
      dispatch(
        handleChatVendorLoaded({
          zChat,
          slider: slider.default
        })
      )

      zChat.on('error', error => {
        // eslint-disable-next-line no-console
        console.warn(error.message)

        if (error.message.includes('Visitor has been banned')) {
          dispatch(chatBanned())
        }
      })

      if (config.authentication) {
        const onAuthFailure = e => {
          if (_.get(e, 'extra.reason') === JWT_ERROR) {
            _.unset(config, 'authentication')
            dispatch({
              type: AUTHENTICATION_FAILED
            })

            zChat.init(makeChatConfig(config))
            if (brandName) zChat.addTag(brandName)
          } else {
            dispatch(chatConnectionError())
          }
        }

        zChat.on('error', onAuthFailure)

        dispatch({
          type: AUTHENTICATION_STARTED
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
        }
      })

      zChat.getFirehose().on('data', firehoseListener(zChat, dispatch))
      zopimApi.handleChatSDKInitialized()
    }
    const onFailure = err => {
      errorTracker.error(err)
    }

    Promise.all([import('chat-web-sdk'), import('react-slick')])
      .then(arr => onChatImported(...arr))
      .catch(onFailure)
  }
}
