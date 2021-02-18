import * as actions from './../base-action-types'
import { CHATTING_SCREEN } from 'src/redux/modules/chat/chat-screen-types'
import { updateChatScreen } from 'src/redux/modules/chat'
import { cancelButtonClicked } from './base-actions'
import { getArticleViewActive } from 'embeds/helpCenter/selectors'
import {
  getChannelChoiceAvailable,
  getAnswerBotAvailable,
  getHelpCenterAvailable,
  getChatAvailable,
  getTalkOnline,
} from 'src/redux/modules/selectors'
import history from 'service/history'
import supportRoutes from 'embeds/support/routes'
import { getFormsToDisplay } from 'embeds/support/selectors'

export const updateActiveEmbed = (embedName) => {
  return {
    type: actions.UPDATE_ACTIVE_EMBED,
    payload: embedName,
  }
}

export const updateBackButtonVisibility = (visible = true) => {
  return {
    type: actions.UPDATE_BACK_BUTTON_VISIBILITY,
    payload: visible,
  }
}

export const showChat = (options = { proactive: false }) => {
  return (dispatch) => {
    dispatch(updateActiveEmbed('chat'))
    if (options.proactive) {
      dispatch(updateChatScreen(CHATTING_SCREEN))
    }
  }
}

export const onChannelChoiceNextClick = (newEmbed) => {
  return (dispatch) => {
    dispatch(updateBackButtonVisibility(true))

    if (newEmbed === 'chat') {
      dispatch(showChat())
    } else {
      dispatch(updateActiveEmbed(newEmbed))
      if (newEmbed === 'ticketSubmissionForm') {
        history.push(supportRoutes.home())
      }
    }
  }
}

export const onCancelClick = () => {
  return (dispatch, getState) => {
    const state = getState()
    const helpCenterAvailable = getHelpCenterAvailable(state)
    const answerBotAvailable = getAnswerBotAvailable(state)
    const channelChoiceAvailable = getChannelChoiceAvailable(state)
    const ticketForms = getFormsToDisplay(state)

    if (answerBotAvailable) {
      dispatch(updateBackButtonVisibility(false))
      dispatch(updateActiveEmbed('answerBot'))
      history.replace('/')
    } else if (helpCenterAvailable) {
      const articleViewActive = getArticleViewActive(state)

      dispatch(updateActiveEmbed('helpCenterForm'))
      dispatch(updateBackButtonVisibility(articleViewActive))
      history.goBack()
      if (ticketForms.length > 1) {
        history.goBack()
      }
    } else if (channelChoiceAvailable) {
      dispatch(updateActiveEmbed('channelChoice'))
      dispatch(updateBackButtonVisibility(false))
    } else {
      if (history.canGo(-1)) {
        history.goBack()
      } else {
        history.replace('/')
      }

      dispatch(cancelButtonClicked())
    }
  }
}

export const onHelpCenterNextClick = () => {
  return (dispatch, getState) => {
    const state = getState()
    const chatAvailable = getChatAvailable(state)
    const talkOnline = getTalkOnline(state)
    const channelChoiceAvailable = getChannelChoiceAvailable(state)
    const helpCenterAvailable = getHelpCenterAvailable(state)

    if (channelChoiceAvailable) {
      dispatch(updateActiveEmbed('channelChoice'))
      if (helpCenterAvailable) {
        dispatch(updateBackButtonVisibility(true))
      }
    } else if (chatAvailable) {
      dispatch(showChat())
      dispatch(updateBackButtonVisibility(true))
    } else if (talkOnline) {
      dispatch(updateActiveEmbed('talk'))
      dispatch(updateBackButtonVisibility(true))
    } else {
      dispatch(updateActiveEmbed('ticketSubmissionForm'))
      history.push(supportRoutes.home())
      if (helpCenterAvailable) {
        dispatch(updateBackButtonVisibility(true))
      }
    }

    dispatch({
      type: actions.NEXT_BUTTON_CLICKED,
    })
  }
}
