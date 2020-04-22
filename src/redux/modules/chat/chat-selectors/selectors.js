import _ from 'lodash'
import { getEmbeddableConfig, getZopimId } from 'src/redux/modules/base/base-selectors'

const chatState = state => state.chat

export const getNotification = state => chatState(state).notification
export const getChats = state => chatState(state).chats
export const isAgent = nick => (nick ? nick.indexOf('agent:') > -1 : false)
export const getThemeMessageType = state => chatState(state).accountSettings.theme.message_type
export const getOrderedAgents = state => chatState(state).agents
export const getShowOperatingHours = state =>
  chatState(state).accountSettings.operatingHours.display_notice
export const getForcedStatus = state => chatState(state).forcedStatus
export const getInactiveAgents = state => chatState(state).inactiveAgents
export const getSocialLogin = state => chatState(state).socialLogin
export const getConnection = state => chatState(state).connection
export const getCurrentMessage = state => chatState(state).currentMessage
export const getChatRating = state => chatState(state).rating
export const getChatScreen = state => chatState(state).screen
export const getShowChatHistory = state => chatState(state).showChatHistory
export const getChatStatus = state => chatState(state).account_status
export const getChatVisitor = state => chatState(state).visitor
export const getIsChatting = state => chatState(state).is_chatting
export const getNotificationCount = state => getNotification(state).count
export const getEmailTranscript = state => chatState(state).emailTranscript
export const getAttachmentsEnabled = state => chatState(state).accountSettings.attachments.enabled
export const getRatingSettings = state => chatState(state).accountSettings.rating
export const getQueuePosition = state => chatState(state).queuePosition
export const getReadOnlyState = state => chatState(state).formState.readOnlyState
export const getChatOfflineForm = state => chatState(state).formState.offlineForm
export const getOfflineMessage = state => chatState(state).offlineMessage
export const getPreChatFormState = state => chatState(state).formState.preChatForm
export const getAgentJoined = state => chatState(state).agentJoined
export const getLastReadTimestamp = state => chatState(state).lastReadTimestamp
export const getOperatingHours = state => chatState(state).operatingHours
export const getLoginSettings = state => chatState(state).accountSettings.login
export const getStandaloneMobileNotificationVisible = state =>
  chatState(state).standaloneMobileNotificationVisible
export const getIsAuthenticated = state => chatState(state).isAuthenticated
export const getZChatVendor = state => chatState(state).vendor.zChat
export const getSliderVendor = state => chatState(state).vendor.slider
export const getWindowSettings = state => chatState(state).accountSettings.chatWindow
export const getThemeColor = state => ({
  base: chatState(state).accountSettings.theme.color.primary,
  text: undefined
})
export const getChatAccountSettingsConcierge = state => chatState(state).accountSettings.concierge
export const getChatAccountSettingsOfflineForm = state =>
  chatState(state).accountSettings.offlineForm
export const getChatAccountSettingsPrechatForm = state =>
  chatState(state).accountSettings.prechatForm
export const getDepartments = state => chatState(state).departments
export const getAccountSettingsLauncherBadge = state => chatState(state).accountSettings.banner
const getAccountSettingsChatBadgeEnabled = state => getAccountSettingsLauncherBadge(state).enabled
const getAccountSettingsBadgeColor = state => chatState(state).accountSettings.theme.color.banner
export const getHideBranding = state => chatState(state).accountSettings.branding.hide_branding
export const getAccountDefaultDepartmentId = state => chatState(state).defaultDepartment.id
export const getDepartmentsList = state => _.values(getDepartments(state))
export const getIsLoggingOut = state => chatState(state).isLoggingOut
export const getChatLog = state => state.chat.chatLog.groups
export const getFirstMessageTimestamp = state => {
  const first = getChats(state)
    .values()
    .next().value

  return first ? first.timestamp : Date.now()
}

export const getCanShowOnlineChat = state => {
  const isChatting = getIsChatting(state)
  const isOnline = getChatStatus(state) === 'online'

  return isChatting || isOnline
}

export const getChatOnline = state => {
  const forcedStatus = getForcedStatus(state)

  if (forcedStatus === 'online') {
    return true
  } else if (forcedStatus === 'offline') {
    return false
  }

  return _.includes(['online', 'away'], getChatStatus(state))
}

export const getThemePosition = state => {
  const position = state.chat.accountSettings.theme.position

  switch (position) {
    case 'br':
      return 'right'
    case 'bl':
      return 'left'
    default:
      return undefined
  }
}

export const getFirstVisitorMessage = state => state.chat.chatLog.firstVisitorMessage
export const getLatestRatingRequest = state => state.chat.chatLog.latestRatingRequest
export const getLatestRating = state => state.chat.chatLog.latestRating
export const getLastMessageAuthor = state => state.chat.chatLog.lastMessageAuthor
export const getLatestAgentLeaveEvent = state => state.chat.chatLog.latestAgentLeaveEvent
export const getLatestQuickReplyKey = state => state.chat.chatLog.latestQuickReply
export const getChatBanned = state => state.chat.chatBanned

export const getHasChatSdkConnected = state => state.chat.sdkConnected
export const getHasBackfillCompleted = state => state.chat.chatLogBackfillCompleted
export const getIsEndChatModalVisible = state => state.chat.endChatModalVisible
export const getDefaultToChatWidgetLite = state => state.chat.config.defaultToChatWidgetLite

export const getDeferredChatApi = state => {
  const config = getEmbeddableConfig(state)
  const zopimId = getZopimId(state)

  const mediatorUrl = _.get(config, 'embeds.chat.props.mediatorHost')
  if (!mediatorUrl || !zopimId) {
    return null
  }

  return `https://${mediatorUrl}/client/widget/account/status?embed_key=${zopimId}`
}

export const getEmbeddableConfigBadgeSettings = state => state.chat.config.badge
const getEmbeddableConfigBadgeSettingsEnabled = state =>
  Boolean(state.chat.config.badge && state.chat.config.badge.enabled)
const getEmbeddableConfigBadgeSettingsColor = state =>
  state.chat.config.badge && state.chat.config.badge.color

export const getChatBadgeEnabled = state => {
  return getAccountSettingsChatBadgeEnabled(state) || getEmbeddableConfigBadgeSettingsEnabled(state)
}
export const getBadgeColor = state => {
  return getAccountSettingsBadgeColor(state) || getEmbeddableConfigBadgeSettingsColor(state)
}
export const getEmbeddableConfigOfflineEnabled = state =>
  _.get(state.chat.config, 'forms.offlineEnabled', false)
