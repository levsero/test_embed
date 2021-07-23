import _ from 'lodash'
import { CONNECTION_STATUSES } from 'src/constants/chat'
import { getUserSoundSettings } from 'src/embeds/chat/selectors'
import routes from 'src/embeds/helpCenter/routes'
import { getArticleDisplayed } from 'src/embeds/helpCenter/selectors'
import { store } from 'src/framework/services/persistence'
import onAgentLeave from 'src/redux/middleware/onStateChange/onAgentLeave'
import onChatConnectOnDemandTrigger from 'src/redux/middleware/onStateChange/onChatConnectOnDemandTrigger'
import onChatOpen from 'src/redux/middleware/onStateChange/onChatOpen'
import onWidgetOpen from 'src/redux/middleware/onStateChange/onWidgetOpen'
import {
  updateActiveEmbed,
  updateBackButtonVisibility,
  activateReceived,
} from 'src/redux/modules/base'
import { UPDATE_EMBEDDABLE_CONFIG } from 'src/redux/modules/base/base-action-types'
import {
  getActiveEmbed,
  getWidgetShown,
  getHasWidgetShown,
  getChatEmbed,
  getHelpCenterEmbed,
  getIPMWidget,
} from 'src/redux/modules/base/base-selectors'
import {
  END_CHAT_REQUEST_SUCCESS,
  SDK_VISITOR_UPDATE,
  CHAT_SOCIAL_LOGIN_SUCCESS,
} from 'src/redux/modules/chat/chat-action-types'
import {
  getAccountSettings,
  newAgentMessageReceived,
  chatNotificationReset,
  getOperatingHours,
  chatConnected,
  chatStarted,
  proactiveMessageReceived,
  chatNotificationTimedOut,
} from 'src/redux/modules/chat/chat-actions/actions'
import { getIsChatting } from 'src/redux/modules/chat/chat-actions/getIsChatting'
import { setUpChat } from 'src/redux/modules/chat/chat-actions/setUpChat'
import {
  getChatMessagesFromAgents,
  getConnection,
  getChatOnline,
  getChatStatus,
  getIsProactiveSession,
  getIsChatting as getIsChattingState,
  getLastReadTimestamp,
  hasUnseenAgentMessage,
  getIsLoggingOut,
} from 'src/redux/modules/chat/chat-selectors'
import { getAnswerBotAvailable, getSubmitTicketAvailable } from 'src/redux/modules/selectors'
import { UPDATE_SETTINGS } from 'src/redux/modules/settings/settings-action-types'
import { updateChatSettings } from 'src/redux/modules/settings/settings-actions'
import {
  getSettingsMobileNotificationsDisabled,
  getCookiesDisabled,
} from 'src/redux/modules/settings/settings-selectors'
import audio from 'src/service/audio'
import history from 'src/service/history'
import { isMobileBrowser } from 'src/util/devices'
import { isPopout } from 'src/util/globals'
import { resetShouldWarn } from 'src/util/nullZChat'

const createdAtTimestamp = Date.now()
let chatAccountSettingsFetched = false
let chatNotificationTimeout = null

const startChatNotificationTimer = ({ proactive }, dispatch) => {
  if (chatNotificationTimeout) {
    clearTimeout(chatNotificationTimeout)
  }

  const timeout = proactive ? 5000 : 3000

  chatNotificationTimeout = setTimeout(() => {
    dispatch(chatNotificationTimedOut())
  }, timeout)
}

const getNewAgentMessage = (state) => {
  const agentChats = getChatMessagesFromAgents(state)
  const newAgentMessage = _.last(agentChats)
  const proactive = getIsProactiveSession(state)

  return { ...newAgentMessage, proactive }
}

const isRecentMessage = (agentMessage) => {
  return agentMessage.timestamp && agentMessage.timestamp > createdAtTimestamp
}

const handleNewAgentMessage = (nextState, dispatch) => {
  const activeEmbed = getActiveEmbed(nextState)
  const widgetShown = getWidgetShown(nextState)
  const hasWidgetShown = getHasWidgetShown(nextState)
  const otherEmbedOpen = widgetShown && activeEmbed !== 'chat'
  const agentMessage = getNewAgentMessage(nextState)
  const recentMessage = isRecentMessage(agentMessage)

  dispatch(newAgentMessageReceived(agentMessage))

  if (hasWidgetShown && recentMessage && getUserSoundSettings(nextState)) {
    audio.play('incoming_message')
  }

  if (!widgetShown || otherEmbedOpen) {
    const isMobileNotificationsDisabled = getSettingsMobileNotificationsDisabled(nextState)
    const isMobile = isMobileBrowser()

    startChatNotificationTimer(agentMessage, dispatch)

    if (
      !widgetShown &&
      !hasWidgetShown &&
      recentMessage &&
      agentMessage.proactive &&
      !(isMobile && isMobileNotificationsDisabled)
    ) {
      dispatch(proactiveMessageReceived())
    }
  }
}

const onChatConnected = (prevState, nextState, dispatch) => {
  if (
    getConnection(prevState) === CONNECTION_STATUSES.CONNECTING &&
    getConnection(nextState) === CONNECTION_STATUSES.CONNECTED
  ) {
    dispatch(updateChatSettings())
    // Order matters, getIsChatting needs to happen before getAccountSettings: https://github.com/zendesk/embeddable_framework/pull/3052
    dispatch(getIsChatting())
    if (!chatAccountSettingsFetched) {
      dispatch(getAccountSettings())
      dispatch(getOperatingHours())
      chatAccountSettingsFetched = true
    }

    dispatch(chatConnected())
  }
}

const onNewChatMessage = (prevState, nextState, dispatch) => {
  const prev = getChatMessagesFromAgents(prevState)
  const next = getChatMessagesFromAgents(nextState)
  const newAgentMessage = next.length > prev.length

  if (newAgentMessage && hasUnseenAgentMessage(nextState)) {
    handleNewAgentMessage(nextState, dispatch)
  }
}

const onLastReadTimestampChange = (prevState, nextState, dispatch) => {
  const prev = getLastReadTimestamp(prevState)
  const next = getLastReadTimestamp(nextState)

  if (prev !== next && !hasUnseenAgentMessage(nextState)) {
    dispatch(chatNotificationReset())
  }
}

const onChatStatusChange = (prevState, nextState, dispatch) => {
  if (getChatStatus(prevState) !== getChatStatus(nextState)) {
    if (!getChatOnline(nextState)) {
      if (
        getSubmitTicketAvailable(nextState) &&
        !getIsChattingState(nextState) &&
        getActiveEmbed(nextState) === 'chat' &&
        !isPopout() &&
        !getIsLoggingOut(nextState)
      ) {
        dispatch(updateActiveEmbed('ticketSubmissionForm'))
      }
    }
  }
}

const onChatEnd = (nextState, action, dispatch) => {
  if (action.type === END_CHAT_REQUEST_SUCCESS) {
    if (!getChatOnline(nextState) && getSubmitTicketAvailable(nextState) && !isPopout()) {
      dispatch(updateActiveEmbed('ticketSubmissionForm'))
    }

    if (getAnswerBotAvailable(nextState)) {
      dispatch(updateBackButtonVisibility(true))
    }
  }
}

const onArticleDisplayed = (prevState, nextState, dispatch) => {
  const prevDisplay = getArticleDisplayed(prevState)
  const articleID = getArticleDisplayed(nextState)

  if (!prevDisplay && articleID) {
    dispatch(updateActiveEmbed('helpCenterForm'))
    const helpCenterEnabled = getHelpCenterEmbed(nextState)
    const ipmWidget = getIPMWidget(nextState)
    const articlePath = routes.articles(articleID)
    if (ipmWidget || !helpCenterEnabled) {
      history.replace(articlePath)
    } else {
      history.push(articlePath)
    }

    const widgetShown = getWidgetShown(prevState)

    if (!widgetShown) dispatch(activateReceived())
  }
}

const onVisitorUpdate = ({ type, payload }, dispatch) => {
  const isVisitorUpdate = type === SDK_VISITOR_UPDATE
  const authObj = _.get(payload, 'detail.auth')
  const avatarPath = _.get(authObj, 'avatar$string')
  const isSociallyAuth = !!_.get(authObj, 'type$string', 'none').match(/^(google|facebook)$/i)

  if (isVisitorUpdate && isSociallyAuth) {
    dispatch({
      type: CHAT_SOCIAL_LOGIN_SUCCESS,
      payload: avatarPath,
    })
  }
}

const onChatStarted = (prevState, nextState, dispatch) => {
  const previouslyChatting = getIsChattingState(prevState)
  const currentlyChatting = getIsChattingState(nextState)
  const answerBot = getAnswerBotAvailable(nextState)

  if (!previouslyChatting && currentlyChatting) {
    dispatch(chatStarted())

    if (answerBot) {
      dispatch(updateBackButtonVisibility(false))
    }
  }
}

const onUpdateEmbeddableConfig = (action) => {
  if (action.type === UPDATE_EMBEDDABLE_CONFIG) {
    if (!_.get(action.payload, 'embeds.chat')) {
      resetShouldWarn()
    }
  }
}

const onCookiePermissionsChange = (action, prevState, nextState, dispatch) => {
  const cookieValue = _.get(action.payload, 'webWidget.cookies')
  const validCookieUpdate =
    cookieValue !== undefined && cookieValue !== !getCookiesDisabled(prevState)
  // the setting is true = enabled, the selector is true = disabled -_-

  if (action.type !== UPDATE_SETTINGS || !validCookieUpdate) return

  if (cookieValue === false) {
    store.disable()
  } else {
    store.enable()
    if (getChatEmbed(nextState) && !getConnection(nextState)) {
      dispatch(setUpChat())
    }
  }
}

export default function onStateChange(
  prevState,
  nextState,
  action = {},
  dispatch = () => {},
  getState = () => {}
) {
  onChatStarted(prevState, nextState, dispatch)
  onChatStatusChange(prevState, nextState, dispatch)
  onChatConnected(prevState, nextState, dispatch)
  onNewChatMessage(prevState, nextState, dispatch)
  onLastReadTimestampChange(prevState, nextState, dispatch)
  onArticleDisplayed(prevState, nextState, dispatch)
  onChatEnd(nextState, action, dispatch)
  onAgentLeave(prevState, nextState, action, dispatch)
  onVisitorUpdate(action, dispatch)
  onWidgetOpen(prevState, nextState, dispatch, getState)
  onChatOpen(prevState, nextState, dispatch)
  onUpdateEmbeddableConfig(action)
  onChatConnectOnDemandTrigger(prevState, action, dispatch)
  onCookiePermissionsChange(action, prevState, nextState, dispatch)
}
