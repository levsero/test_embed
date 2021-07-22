import { combineReducers } from 'redux'
import contactDetailsSubmissionPending from 'embeds/chat/reducers/contact-details-submission-pending'
import deferredChatHasResponse from 'embeds/chat/reducers/deferred-chat-has-response'
import deferredChatIsPolling from 'embeds/chat/reducers/deferred-chat-is-polling'
import soundEnabled from 'embeds/chat/reducers/sound-enabled'
import contactDetailsSubmissionError from 'src/embeds/chat/reducers/contact-details-submission-error'
import menuVisible from 'src/embeds/chat/reducers/is-menu-visible'
import visitor from 'src/embeds/chat/reducers/visitor'
import { CHAT_USER_LOGGING_OUT } from '../chat-action-types'
import accountSettings from './account-settings/'
import accountStatus from './chat-account-status'
import activeAgents from './chat-active-agents'
import agentEndedChatSession from './chat-agent-ended-chat-session'
import agentJoined from './chat-agent-joined'
import chatBanned from './chat-banned'
import chats from './chat-chats'
import config from './chat-config'
import connection from './chat-connection'
import currentMessage from './chat-current-message'
import defaultDepartment from './chat-default-department'
import departments from './chat-departments'
import editContactDetails from './chat-edit-contact-details'
import emailTranscript from './chat-email-transcript'
import endChatModalVisible from './chat-end-chat-modal-visible'
import forcedStatus from './chat-forced-status'
import chatHistory from './chat-history'
import inactiveAgents from './chat-inactive-agents'
import isAuthenticated from './chat-is-authenticated'
import isChatting from './chat-is-chatting'
import isLoggingOut from './chat-is-logging-out'
import lastReadTimestamp from './chat-last-read-timestamp'
import chatLog from './chat-log'
import chatLogBackfillCompleted from './chat-log-backfill-completed'
import notification from './chat-notification'
import offlineMessage from './chat-offline-message'
import operatingHours from './chat-operating-hours'
import queuePosition from './chat-queue-position'
import rating from './chat-rating'
import screen from './chat-screen'
import sdkConnected from './chat-sdk-connected'
import showChatHistory from './chat-show-history'
import socialLogin from './chat-social-login'
import standaloneMobileNotificationVisible from './chat-standalone-mobile-notification-visible'
import vendor from './chat-vendor'
import formState from './form-state'

const combinedReducers = combineReducers({
  accountSettings,
  account_status: accountStatus,
  agentEndedChatSession,
  agentJoined,
  activeAgents,
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
  soundEnabled,
  contactDetailsSubmissionPending,
  contactDetailsSubmissionError,
})

export default function reducer(state, action) {
  if (action.type === CHAT_USER_LOGGING_OUT) {
    state = {
      vendor: state.vendor,
      isLoggingOut: state.isLoggingOut,
      screen: state.screen,
      accountSettings: state.accountSettings,
    }
  }

  return combinedReducers(state, action)
}
