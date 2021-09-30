import _ from 'lodash'
import createCachedSelector from 're-reselect'
import { createSelector } from 'reselect'
import isFeatureEnabled from 'src/embeds/webWidget/selectors/feature-flags'
import { getEmbeddableConfig, getZopimId } from 'src/redux/modules/base/base-selectors'
import { getSettingsChatDepartmentsEnabled } from 'src/redux/modules/settings/settings-selectors'

const getHistory = (state) => state.chat.chatHistory.chats

const getState = (state) => state.chat

export const getIsPollingChat = (state) =>
  !getEmbeddableConfig(state).disableStatusPolling && getState(state).deferredChatIsPolling

export const getDeferredChatHasResponse = (state) => getState(state).deferredChatHasResponse

export const getVisitorEmail = (state) => getState(state).visitor.email

export const getMenuVisible = (state) => getState(state).menuVisible

export const getUserSoundSettings = (state) => getState(state).soundEnabled

export const getNotification = (state) => getState(state).notification
export const getChats = (state) => getState(state).chats
export const isAgent = (nick) => (nick ? nick.indexOf('agent:') > -1 : false)
export const getThemeMessageType = (state) => getState(state).accountSettings.theme.message_type
export const getOrderedAgents = (state) => getState(state).activeAgents
export const getShowOperatingHours = (state) =>
  getState(state).accountSettings.operatingHours.display_notice
export const getForcedStatus = (state) => getState(state).forcedStatus
export const getInactiveAgents = (state) => getState(state).inactiveAgents
export const getSocialLogin = (state) => getState(state).socialLogin
export const getConnection = (state) => getState(state).connection
export const getCurrentMessage = (state) => getState(state).currentMessage
export const getChatRating = (state) => getState(state).rating
export const getChatScreen = (state) => getState(state).screen
export const getShowChatHistory = (state) => getState(state).showChatHistory
export const getChatStatus = (state) => getState(state).account_status
export const getChatVisitor = (state) => getState(state).visitor
export const getIsChatting = (state) => getState(state).is_chatting
export const getNotificationCount = (state) => getNotification(state).count
export const getEmailTranscript = (state) => getState(state).emailTranscript
export const getAttachmentsEnabled = (state) => getState(state).accountSettings.attachments.enabled
export const getRatingSettings = (state) => getState(state).accountSettings.rating
export const getQueuePosition = (state) => getState(state).queuePosition
export const getReadOnlyState = (state) => getState(state).formState.readOnlyState
export const getChatOfflineForm = (state) => getState(state).formState.offlineForm
export const getOfflineMessage = (state) => getState(state).offlineMessage
export const getPreChatFormState = (state) => getState(state).formState.preChatForm
export const getAgentJoined = (state) => getState(state).agentJoined
export const getAgentEndedChatSession = (state) => getState(state).agentEndedChatSession
export const getLastReadTimestamp = (state) => getState(state).lastReadTimestamp
export const getOperatingHours = (state) => getState(state).operatingHours
export const getLoginSettings = (state) => getState(state).accountSettings.login
export const getStandaloneMobileNotificationVisible = (state) =>
  getState(state).standaloneMobileNotificationVisible
export const getIsAuthenticated = (state) => getState(state).isAuthenticated
export const getZChatVendor = (state) => getState(state).vendor.zChat
export const getSliderVendor = (state) => getState(state).vendor.slider
export const getWindowSettings = (state) => getState(state).accountSettings.chatWindow
export const getThemeColor = (state) => ({
  base: getState(state).accountSettings.theme.color.primary,
  text: undefined,
})
export const getChatAccountSettingsConcierge = (state) => getState(state).accountSettings.concierge
export const getChatAccountSettingsOfflineForm = (state) =>
  getState(state).accountSettings.offlineForm
export const getChatAccountSettingsPrechatForm = (state) =>
  getState(state).accountSettings.prechatForm
export const getDepartments = (state) => getState(state).departments
export const getAccountSettingsLauncherBadge = (state) => getState(state).accountSettings.banner
const getAccountSettingsChatBadgeEnabled = (state) => getAccountSettingsLauncherBadge(state).enabled
const getAccountSettingsBadgeColor = (state) => getState(state).accountSettings.theme.color.banner
export const getHideBranding = (state) => getState(state).accountSettings.branding.hide_branding
export const getAccountDefaultDepartmentId = (state) => getState(state).defaultDepartment.id
export const getDepartmentsList = (state) => _.values(getDepartments(state))
export const getIsLoggingOut = (state) => getState(state).isLoggingOut
export const getChatLog = (state) => state.chat.chatLog.groups
export const getFirstMessageTimestamp = (state) => {
  const first = getChats(state).values().next().value

  return first ? first.timestamp : Date.now()
}

export const getCanShowOnlineChat = (state) => {
  const isChatting = getIsChatting(state)
  const isOnline = getChatStatus(state) === 'online'

  return isChatting || isOnline
}

const getAreAllEnabledDepartmentsOffline = createSelector(
  [getSettingsChatDepartmentsEnabled, getDepartmentsList],
  (settingsDepartmentsEnabled, departmentsList) => {
    if (!Array.isArray(settingsDepartmentsEnabled)) {
      // Customer hasn't filtered anything
      return false
    }

    if (settingsDepartmentsEnabled.length === 0) {
      // Customer has filtered all departments - but this means to not show
      // them in prechat form, rather than filter them.
      // Chat should still be considered as online
      return false
    }

    const enabledAndOnlineDepartments = departmentsList
      .filter(
        (department) =>
          _.includes(settingsDepartmentsEnabled, department.id) ||
          _.includes(settingsDepartmentsEnabled, department.name.toLowerCase())
      )
      .filter((department) => department.status === 'online')

    return enabledAndOnlineDepartments.length === 0
  }
)

export const getChatOnline = (state) => {
  const forcedStatus = getForcedStatus(state)

  if (forcedStatus === 'online') {
    return true
  } else if (forcedStatus === 'offline') {
    return false
  }

  const isOnline = _.includes(['online', 'away'], getChatStatus(state))
  const isDepartmentsVisibleFeatureEnabled = isFeatureEnabled(
    state,
    'web_widget_prechat_form_visible_departments'
  )

  if (isOnline && isDepartmentsVisibleFeatureEnabled) {
    if (getAreAllEnabledDepartmentsOffline(state)) {
      return false
    }
  }

  return isOnline
}

export const getThemePosition = (state) => {
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

export const getFirstVisitorMessage = (state) => state.chat.chatLog.firstVisitorMessage
export const getLatestRatingRequest = (state) => state.chat.chatLog.latestRatingRequest
export const getLatestRating = (state) => state.chat.chatLog.latestRating
export const getLastMessageAuthor = (state) => state.chat.chatLog.lastMessageAuthor
export const getLatestAgentLeaveEvent = (state) => state.chat.chatLog.latestAgentLeaveEvent
export const getLatestQuickReplyKey = (state) => state.chat.chatLog.latestQuickReply
export const getChatBanned = (state) => state.chat.chatBanned

export const getHasChatSdkConnected = (state) => state.chat.sdkConnected
export const getHasBackfillCompleted = (state) => state.chat.chatLogBackfillCompleted
export const getIsEndChatModalVisible = (state) => state.chat.endChatModalVisible
export const getDefaultToChatWidgetLite = (state) => state.chat.config.defaultToChatWidgetLite

export const getDeferredChatApi = (state) => {
  const config = getEmbeddableConfig(state)
  const zopimId = getZopimId(state)

  const mediatorUrl = _.get(config, 'embeds.chat.props.mediatorHost')
  if (!mediatorUrl || !zopimId) {
    return null
  }

  return `https://${mediatorUrl}/client/widget/account/status?embed_key=${zopimId}`
}

export const getEmbeddableConfigBadgeSettings = (state) => state.chat.config.badge
const getEmbeddableConfigBadgeSettingsEnabled = (state) =>
  Boolean(state.chat.config.badge && state.chat.config.badge.enabled)
const getEmbeddableConfigBadgeSettingsColor = (state) =>
  state.chat.config.badge && state.chat.config.badge.color

export const getChatBadgeEnabled = (state) => {
  return getAccountSettingsChatBadgeEnabled(state) || getEmbeddableConfigBadgeSettingsEnabled(state)
}
export const getBadgeColor = (state) => {
  return getAccountSettingsBadgeColor(state) || getEmbeddableConfigBadgeSettingsColor(state)
}
export const getEmbeddableConfigOfflineEnabled = (state) =>
  _.get(state.chat.config, 'forms.offlineEnabled', false)

export const getContactDetailsSubmissionPending = (state) =>
  getState(state).contactDetailsSubmissionPending

export const getContactDetailsSubmissionError = (state) =>
  getState(state).contactDetailsSubmissionError

export const getEditContactDetails = (state) => getState(state).editContactDetails

export const getShowEditContactDetails = (state) => getEditContactDetails(state).show

export const getHistoryEventMessage = createCachedSelector(
  getHistory,
  (state, messageKey) => messageKey,
  (history, messageKey) => history.get(messageKey)
)((state, messageKey) => messageKey)

export const getEventMessage = createCachedSelector(
  getChats,
  (_state, messageKey) => messageKey,
  (chats, messageKey) => chats.get(messageKey)
)((_state, messageKey) => messageKey)
