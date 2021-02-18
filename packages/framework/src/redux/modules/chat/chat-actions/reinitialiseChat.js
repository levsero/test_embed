import { onChatSDKInitialized } from 'src/service/api/zopimApi/callbacks'
import { CONNECTION_STATUSES } from 'src/constants/chat'
import { getZChatConfig } from 'src/redux/modules/base/base-selectors'
import { getIsLoggingOut, getZChatVendor } from 'src/redux/modules/chat/chat-selectors'
import { settings } from 'service/settings'
import {
  CHAT_USER_LOGGING_OUT,
  CHAT_USER_LOGGED_OUT,
  AUTHENTICATION_STARTED
} from '../chat-action-types'
import { fetchConversationHistory } from './actions'

export function reinitialiseChat(withAuth = false) {
  return (dispatch, getState) => {
    onChatSDKInitialized(() => {
      const state = getState()
      const zChat = getZChatVendor(state)
      let zChatConfig = getZChatConfig(state)

      zChat.on('connection_update', connectionStatus => {
        const isLoggingOut = getIsLoggingOut(getState())

        if (connectionStatus === CONNECTION_STATUSES.CONNECTED && isLoggingOut) {
          dispatch({
            type: CHAT_USER_LOGGED_OUT
          })
        }
      })

      zChat.endChat(() => {
        dispatch({
          type: CHAT_USER_LOGGING_OUT
        })

        if (withAuth) {
          const authentication = settings.getChatAuthSettings()
          if (authentication?.jwtFn) {
            zChatConfig = {
              ...zChatConfig,
              authentication: {
                jwt_fn: authentication.jwtFn
              }
            }
          }
        }

        zChat.logoutForAll()
        zChat.init(zChatConfig)

        if (withAuth) {
          dispatch({
            type: AUTHENTICATION_STARTED
          })

          zChat.setOnFirstReady({
            fetchHistory: () => {
              dispatch(fetchConversationHistory())
            }
          })
        }
      })
    })
  }
}
