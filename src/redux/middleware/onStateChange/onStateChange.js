import _ from 'lodash'

import {
  getAccountSettings,
  newAgentMessageReceived,
  chatNotificationReset,
  getOperatingHours,
  chatConnected,
  chatStarted
} from 'src/redux/modules/chat/chat-actions/actions'
import { setUpChat } from 'src/redux/modules/chat/chat-actions/setUpChat'
import { getIsChatting } from 'src/redux/modules/chat/chat-actions/getIsChatting'
import {
  updateActiveEmbed,
  updateBackButtonVisibility,
  activateRecieved
} from 'src/redux/modules/base'
import {
  END_CHAT_REQUEST_SUCCESS,
  SDK_VISITOR_UPDATE,
  CHAT_SOCIAL_LOGIN_SUCCESS
} from 'src/redux/modules/chat/chat-action-types'
import { UPDATE_EMBEDDABLE_CONFIG } from 'src/redux/modules/base/base-action-types'
import { CONNECTION_STATUSES } from 'src/constants/chat'
import { audio } from 'service/audio'
import { mediator } from 'service/mediator'
import {
  getChatMessagesFromAgents,
  getConnection,
  getChatOnline,
  getChatStatus,
  getIsProactiveSession,
  getUserSoundSettings,
  getIsChatting as getIsChattingState,
  getLastReadTimestamp,
  hasUnseenAgentMessage
} from 'src/redux/modules/chat/chat-selectors'
import { getArticleDisplayed, getHasSearched } from 'embeds/helpCenter/selectors'
import {
  getActiveEmbed,
  getWidgetShown,
  getIPMWidget,
  getHelpCenterEmbed,
  getSubmitTicketEmbed,
  getHasWidgetShown,
  getChatEmbed
} from 'src/redux/modules/base/base-selectors'
import { store } from 'service/persistence'
import {
  getSettingsMobileNotificationsDisabled,
  getCookiesDisabled
} from 'src/redux/modules/settings/settings-selectors'
import { getAnswerBotAvailable } from 'src/redux/modules/selectors'
import { isMobileBrowser } from 'utility/devices'
import { resetShouldWarn } from 'src/util/nullZChat'
import onWidgetOpen from 'src/redux/middleware/onStateChange/onWidgetOpen'
import onChatOpen from 'src/redux/middleware/onStateChange/onChatOpen'
import onAgentLeave from 'src/redux/middleware/onStateChange/onAgentLeave'
import onChannelChoiceTransition from 'src/redux/middleware/onStateChange/onChannelChoiceTransition'
import onChatConnectOnDemandTrigger from 'src/redux/middleware/onStateChange/onChatConnectOnDemandTrigger'
import { onZopimChatStateChange } from 'src/redux/middleware/onStateChange/onZopimStateChange'
import { updateChatSettings } from 'src/redux/modules/settings/settings-actions'
import { isPopout } from 'utility/globals'
import { UPDATE_SETTINGS } from 'src/redux/modules/settings/settings-action-types'

const createdAtTimestamp = Date.now()
let chatAccountSettingsFetched = false
let chatNotificationTimeout = null

const startChatNotificationTimer = ({ proactive }) => {
  if (chatNotificationTimeout) {
    clearTimeout(chatNotificationTimeout)
  }

  const timeout = proactive ? 5000 : 3000

  chatNotificationTimeout = setTimeout(() => {
    mediator.channel.broadcast('webWidget.hideChatNotification')
  }, timeout)
}

const getNewAgentMessage = state => {
  const agentChats = getChatMessagesFromAgents(state)
  const newAgentMessage = _.last(agentChats)
  const proactive = getIsProactiveSession(state)

  return { ...newAgentMessage, proactive }
}

const isRecentMessage = agentMessage => {
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

    if (
      _.size(getChatMessagesFromAgents(nextState)) === 1 &&
      !isMobile &&
      activeEmbed === 'helpCenterForm' &&
      !getHasSearched(nextState)
    ) {
      dispatch(updateActiveEmbed('chat'))
    }

    startChatNotificationTimer(agentMessage)

    if (
      !widgetShown &&
      recentMessage &&
      agentMessage.proactive &&
      !(isMobile && isMobileNotificationsDisabled)
    ) {
      mediator.channel.broadcast('newChat.newMessage')
    }
  }
}

const onChatConnected = (prevState, nextState, dispatch) => {
  if (
    getConnection(prevState) === CONNECTION_STATUSES.CONNECTING &&
    getConnection(nextState) === CONNECTION_STATUSES.CONNECTED
  ) {
    dispatch(chatConnected())
    dispatch(updateChatSettings())

    if (!chatAccountSettingsFetched) {
      dispatch(getIsChatting())
      dispatch(getAccountSettings())
      dispatch(getOperatingHours())
      chatAccountSettingsFetched = true
    }
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
        getSubmitTicketEmbed(nextState) &&
        !getIsChattingState(nextState) &&
        getActiveEmbed(nextState) === 'chat' &&
        !isPopout()
      ) {
        dispatch(updateActiveEmbed('ticketSubmissionForm'))
      }
    }
  }
}

const onChatEnd = (nextState, action, dispatch) => {
  if (action.type === END_CHAT_REQUEST_SUCCESS) {
    if (!getChatOnline(nextState) && getSubmitTicketEmbed(nextState) && !isPopout()) {
      dispatch(updateActiveEmbed('ticketSubmissionForm'))
    }
    if (getAnswerBotAvailable(nextState)) {
      dispatch(updateBackButtonVisibility(true))
    }
  }
}

const onArticleDisplayed = (prevState, nextState, dispatch) => {
  const prevDisplay = getArticleDisplayed(prevState)
  const nextDisplay = getArticleDisplayed(nextState)

  if (!prevDisplay && nextDisplay) {
    const ipmWidget = getIPMWidget(prevState)
    const isBackButtonVisible = ipmWidget ? false : getHelpCenterEmbed(prevState)
    const widgetShown = getWidgetShown(prevState)

    dispatch(updateBackButtonVisibility(isBackButtonVisible))
    if (!widgetShown) dispatch(activateRecieved())
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
      payload: avatarPath
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

const onUpdateEmbeddableConfig = action => {
  if (action.type === UPDATE_EMBEDDABLE_CONFIG) {
    if (action.payload) {
      if (!action.payload.newChat) {
        resetShouldWarn()
      }
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

export default function onStateChange(prevState, nextState, action = {}, dispatch = () => {}) {
  onChatStarted(prevState, nextState, dispatch)
  onChatStatusChange(prevState, nextState, dispatch)
  onZopimChatStateChange(prevState, nextState, dispatch)
  onChatConnected(prevState, nextState, dispatch)
  onNewChatMessage(prevState, nextState, dispatch)
  onLastReadTimestampChange(prevState, nextState, dispatch)
  onArticleDisplayed(prevState, nextState, dispatch)
  onChatEnd(nextState, action, dispatch)
  onAgentLeave(prevState, nextState, action, dispatch)
  onVisitorUpdate(action, dispatch)
  onWidgetOpen(prevState, nextState)
  onChatOpen(prevState, nextState, dispatch)
  onUpdateEmbeddableConfig(action)
  onChannelChoiceTransition(prevState, nextState, action, dispatch)
  onChatConnectOnDemandTrigger(prevState, action, dispatch)
  onCookiePermissionsChange(action, prevState, nextState, dispatch)
}
