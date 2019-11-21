import _ from 'lodash'

import {
  WIDGET_INITIALISED,
  ACTIVATE_RECEIVED,
  AUTHENTICATION_SUCCESS,
  API_RESET_WIDGET,
  CLOSE_BUTTON_CLICKED
} from 'src/redux/modules/base/base-action-types'
import { UPDATE_SETTINGS } from 'src/redux/modules/settings/settings-action-types'
import {
  TALK_EMBEDDABLE_CONFIG_SOCKET_EVENT,
  TALK_AGENT_AVAILABILITY_SOCKET_EVENT,
  TALK_SUCCESS_DONE_BUTTON_CLICKED
} from 'src/redux/modules/talk/talk-action-types'
import {
  CHAT_BANNED,
  CHAT_CONNECTED,
  GET_ACCOUNT_SETTINGS_REQUEST_SUCCESS,
  SDK_ACCOUNT_STATUS,
  SDK_CONNECTION_UPDATE
} from 'src/redux/modules/chat/chat-action-types'
import { updateActiveEmbed, updateBackButtonVisibility } from 'src/redux/modules/base'
import { getChatStandalone, getActiveEmbed } from 'src/redux/modules/base/base-selectors'
import {
  getChatAvailable,
  getTalkOnline,
  getChannelChoiceAvailable,
  getHelpCenterAvailable,
  getShowTicketFormsBackButton,
  getIpmHelpCenterAllowed,
  getSubmitTicketAvailable,
  getAnswerBotAvailable,
  getWebWidgetVisible
} from 'src/redux/modules/selectors'
import { getArticleViewActive } from 'embeds/helpCenter/selectors'
import { getIsChatting, getChatBanned } from 'src/redux/modules/chat/chat-selectors'
import { isPopout } from 'utility/globals'
import { EMBED_MAP, NIL_EMBED } from 'constants/shared'
import { UPDATE_DEFERRED_CHAT_ONLINE_STATUS } from 'embeds/chat/actions/action-types'

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
  const widgetVisible = getWebWidgetVisible(state)
  const shouldSuppressActiveEmbed = _.includes(
    suppressedEmbeds,
    EMBED_MAP[activeEmbed] || activeEmbed
  )

  return widgetVisible ? shouldSuppressActiveEmbed : !_.isEmpty(suppressedEmbeds)
}

const setNewActiveEmbed = (state, dispatch) => {
  let backButton = false
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
  } else if (getIpmHelpCenterAllowed(state) && articleViewActive) {
    // we only go into this condition if HC is injected by IPM
    activeEmbed = 'helpCenterForm'
    backButton = false
  } else if (getChannelChoiceAvailable(state)) {
    activeEmbed = 'channelChoice'
  } else if (getTalkOnline(state)) {
    activeEmbed = 'talk'
  } else if (getChatAvailable(state) || (getChatStandalone(state) && !getChatBanned(state))) {
    activeEmbed = 'chat'
  } else if (getSubmitTicketAvailable(state)) {
    activeEmbed = 'ticketSubmissionForm'
    backButton = getShowTicketFormsBackButton(state)
  } else if (getChatBanned(state)) {
    activeEmbed = NIL_EMBED
  }

  dispatch(updateActiveEmbed(activeEmbed))
  dispatch(updateBackButtonVisibility(backButton))
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
    UPDATE_DEFERRED_CHAT_ONLINE_STATUS
  ]
  const widgetVisible = getWebWidgetVisible(prevState)
  const isChatting = getIsChatting(prevState) && getActiveEmbed(prevState) === 'chat'
  const shouldReset =
    (_.includes(updateActions, type) && !isChatting) || shouldResetForChat(type, nextState)
  const shouldResetForChatChannelChoice =
    type === CLOSE_BUTTON_CLICKED &&
    !getChatAvailable(prevState) &&
    getActiveEmbed(prevState) === 'channelChoice'

  if (
    (!widgetVisible && shouldReset) ||
    shouldResetForSuppress(action, prevState) ||
    shouldResetForChatChannelChoice
  ) {
    setNewActiveEmbed(nextState, dispatch)
  }
}
