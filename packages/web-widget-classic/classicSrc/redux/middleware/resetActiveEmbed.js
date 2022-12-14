import { EMBED_MAP, NIL_EMBED } from 'classicSrc/constants/shared'
import { RECEIVE_DEFERRED_CHAT_STATUS } from 'classicSrc/embeds/chat/actions/action-types'
import { getIsChatting, getChatBanned } from 'classicSrc/embeds/chat/selectors'
import helpCenterRoutes from 'classicSrc/embeds/helpCenter/routes'
import { getArticleViewActive } from 'classicSrc/embeds/helpCenter/selectors'
import supportRoutes from 'classicSrc/embeds/support/routes'
import {
  TALK_EMBEDDABLE_CONFIG_SOCKET_EVENT,
  TALK_AGENT_AVAILABILITY_SOCKET_EVENT,
  TALK_SUCCESS_DONE_BUTTON_CLICKED,
  RECEIVED_DEFERRED_TALK_STATUS,
} from 'classicSrc/embeds/talk/action-types'
import { updateActiveEmbed, updateBackButtonVisibility } from 'classicSrc/redux/modules/base'
import {
  WIDGET_INITIALISED,
  ACTIVATE_RECEIVED,
  AUTHENTICATION_SUCCESS,
  API_RESET_WIDGET,
  CLOSE_BUTTON_CLICKED,
} from 'classicSrc/redux/modules/base/base-action-types'
import { getChatStandalone, getActiveEmbed } from 'classicSrc/redux/modules/base/base-selectors'
import {
  CHAT_BANNED,
  CHAT_CONNECTED,
  GET_ACCOUNT_SETTINGS_REQUEST_SUCCESS,
  SDK_ACCOUNT_STATUS,
  SDK_CONNECTION_UPDATE,
} from 'classicSrc/redux/modules/chat/chat-action-types'
import {
  getChatAvailable,
  getTalkOnline,
  getChannelChoiceAvailable,
  getHelpCenterAvailable,
  getIpmHelpCenterAllowed,
  getSubmitTicketAvailable,
  getAnswerBotAvailable,
  getWebWidgetVisibleOpenAndReady,
} from 'classicSrc/redux/modules/selectors'
import { UPDATE_SETTINGS } from 'classicSrc/redux/modules/settings/settings-action-types'
import history from 'classicSrc/service/history'
import _ from 'lodash'
import { isPopout } from '@zendesk/widget-shared-services'

const shouldResetForChat = (type, state) => {
  const activeEmbed = getActiveEmbed(state)
  const eligibleChatActions = [SDK_CONNECTION_UPDATE, SDK_ACCOUNT_STATUS, CHAT_BANNED]
  const eligibleActiveEmbeds = ['chat', 'channelChoice', 'ticketSubmissionForm', NIL_EMBED]
  const isChatActionEligible = _.includes(eligibleChatActions, type)
  const isActiveEmbedEligible = _.includes(eligibleActiveEmbeds, activeEmbed)

  return isChatActionEligible && isActiveEmbedEligible
}

const shouldResetForSuppress = (action, state) => {
  const { type, payload } = action

  if (type !== UPDATE_SETTINGS) return false

  const suppressedEmbeds = _.reduce(
    payload.webWidget,
    (result, value, key) => {
      if (_.hasIn(value, 'suppress') || _.hasIn(value, 'hideWhenOffline')) {
        result.push(key)
      }
      return result
    },
    []
  )
  const activeEmbed = getActiveEmbed(state)
  const widgetVisibleOpenAndReady = getWebWidgetVisibleOpenAndReady(state)
  const shouldSuppressActiveEmbed = _.includes(
    suppressedEmbeds,
    EMBED_MAP[activeEmbed] || activeEmbed
  )

  return widgetVisibleOpenAndReady ? shouldSuppressActiveEmbed : !_.isEmpty(suppressedEmbeds)
}

const setNewActiveEmbed = (state, dispatch) => {
  let backButton = false
  let newRoute = null
  let activeEmbed = NIL_EMBED
  const articleViewActive = getArticleViewActive(state)

  if (isPopout()) {
    activeEmbed = 'chat'
  } else if (getAnswerBotAvailable(state)) {
    activeEmbed = 'answerBot'
    if (articleViewActive) {
      activeEmbed = 'helpCenterForm'
      backButton = true
    } else if (getIsChatting(state)) {
      activeEmbed = 'chat'
    } else {
      activeEmbed = 'answerBot'
      backButton = false
    }
  } else if (getHelpCenterAvailable(state)) {
    activeEmbed = 'helpCenterForm'
    backButton = articleViewActive
    newRoute = helpCenterRoutes.home()
  } else if (getIpmHelpCenterAllowed(state) && articleViewActive) {
    // we only go into this condition if HC is injected by IPM
    activeEmbed = 'helpCenterForm'
    backButton = false
  } else if (getChannelChoiceAvailable(state)) {
    activeEmbed = 'channelChoice'
  } else if (getTalkOnline(state)) {
    activeEmbed = 'talk'
  } else if ((getChatAvailable(state) || getChatStandalone(state)) && !getChatBanned(state)) {
    activeEmbed = 'chat'
  } else if (getSubmitTicketAvailable(state)) {
    activeEmbed = 'ticketSubmissionForm'
    newRoute = supportRoutes.home()
  } else if (getChatBanned(state)) {
    activeEmbed = NIL_EMBED
  }

  dispatch(updateActiveEmbed(activeEmbed))
  dispatch(updateBackButtonVisibility(backButton))

  if (newRoute) {
    history.replace(newRoute)
  }
}

export default function resetActiveEmbed(prevState, nextState, action, dispatch = () => {}) {
  const { type } = action
  const updateActions = [
    TALK_EMBEDDABLE_CONFIG_SOCKET_EVENT,
    TALK_AGENT_AVAILABILITY_SOCKET_EVENT,
    WIDGET_INITIALISED,
    ACTIVATE_RECEIVED,
    AUTHENTICATION_SUCCESS,
    CHAT_CONNECTED,
    API_RESET_WIDGET,
    GET_ACCOUNT_SETTINGS_REQUEST_SUCCESS,
    TALK_SUCCESS_DONE_BUTTON_CLICKED,
    RECEIVE_DEFERRED_CHAT_STATUS,
    RECEIVED_DEFERRED_TALK_STATUS,
  ]
  const widgetVisibleOpenAndReady = getWebWidgetVisibleOpenAndReady(prevState)
  const isChatting = getIsChatting(prevState) && getActiveEmbed(prevState) === 'chat'
  const shouldReset =
    (_.includes(updateActions, type) && !isChatting) || shouldResetForChat(type, nextState)
  const shouldResetForChatChannelChoice =
    type === CLOSE_BUTTON_CLICKED &&
    !getChatAvailable(prevState) &&
    getActiveEmbed(prevState) === 'channelChoice'

  if (
    (!widgetVisibleOpenAndReady && shouldReset) ||
    shouldResetForSuppress(action, prevState) ||
    shouldResetForChatChannelChoice ||
    action.type === CHAT_BANNED
  ) {
    setNewActiveEmbed(nextState, dispatch)
  }
}
