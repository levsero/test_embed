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
import visitor from './chat-visitor'
import rating from './chat-rating'
import notification from './chat-notification'
import standaloneMobileNotificationVisible from './chat-standalone-mobile-notification-visible'
import screen from './chat-screen'
import userSettings from './user-settings/'
import emailTranscript from './chat-email-transcript'
import editContactDetails from './chat-edit-contact-details'
import formState from './form-state'
import queuePosition from './chat-queue-position'
import offlineMessage from './chat-offline-message'
import menuVisible from './chat-menu-visibility'
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

const combinedReducers = combineReducers({
  accountSettings,
  account_status: accountStatus,
  agentJoined,
  agents,
  chatBanned,
  chatHistory,
  chatLog,
  chats,
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
  socialLogin,
  standaloneMobileNotificationVisible,
  userSettings,
  vendor,
  visitor,
  showChatHistory
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
