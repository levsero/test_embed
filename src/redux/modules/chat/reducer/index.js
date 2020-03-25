import { combineReducers } from 'redux'

import { CHAT_USER_LOGGING_OUT } from '../chat-action-types'
import accountSettings from './account-settings/'
import accountStatus from './chat-account-status'
import agents from './chat-agents'
import inactiveAgents from './chat-inactive-agents'
import chats from './chat-chats'
import chatHistory from './chat-history'
import chatLog from './chat-log'
import connection from './chat-connection'
import currentMessage from './chat-current-message'
import departments from './chat-departments'
import isChatting from './chat-is-chatting'
import sdkConnected from './chat-sdk-connected'
import visitor from 'src/embeds/chat/reducers/visitor'
import rating from './chat-rating'
import notification from './chat-notification'
import standaloneMobileNotificationVisible from './chat-standalone-mobile-notification-visible'
import screen from './chat-screen'
import emailTranscript from './chat-email-transcript'
import editContactDetails from './chat-edit-contact-details'
import formState from './form-state'
import queuePosition from './chat-queue-position'
import offlineMessage from './chat-offline-message'
import menuVisible from 'src/embeds/chat/reducers/is-menu-visible'
import agentJoined from './chat-agent-joined'
import lastReadTimestamp from './chat-last-read-timestamp'
import operatingHours from './chat-operating-hours'
import socialLogin from './chat-social-login'
import isAuthenticated from './chat-is-authenticated'
import vendor from './chat-vendor'
import isLoggingOut from './chat-is-logging-out'
import forcedStatus from './chat-forced-status'
import defaultDepartment from './chat-default-department'
import showChatHistory from './chat-show-history'
import chatBanned from './chat-banned'
import chatLogBackfillCompleted from './chat-log-backfill-completed'
import endChatModalVisible from './chat-end-chat-modal-visible'
import config from './chat-config'
import deferredChatIsPolling from 'embeds/chat/reducers/deferred-chat-is-polling'
import deferredChatHasResponse from 'embeds/chat/reducers/deferred-chat-has-response'
import soundEnabled from 'embeds/chat/reducers/sound-enabled'

const combinedReducers = combineReducers({
  accountSettings,
  account_status: accountStatus,
  agentJoined,
  agents,
  chatBanned,
  chatHistory,
  chatLog,
  chats,
  config,
  connection,
  currentMessage,
  defaultDepartment,
  departments,
  editContactDetails,
  emailTranscript,
  forcedStatus,
  formState,
  inactiveAgents,
  isAuthenticated,
  isLoggingOut,
  is_chatting: isChatting,
  lastReadTimestamp,
  menuVisible,
  notification,
  offlineMessage,
  operatingHours,
  queuePosition,
  rating,
  screen,
  sdkConnected,
  socialLogin,
  standaloneMobileNotificationVisible,
  vendor,
  visitor,
  showChatHistory,
  chatLogBackfillCompleted,
  endChatModalVisible,
  deferredChatIsPolling,
  deferredChatHasResponse,
  soundEnabled
})

export default function reducer(state, action) {
  if (action.type === CHAT_USER_LOGGING_OUT) {
    state = {
      vendor: state.vendor,
      isLoggingOut: state.isLoggingOut,
      screen: state.screen,
      accountSettings: state.accountSettings
    }
  }

  return combinedReducers(state, action)
}
