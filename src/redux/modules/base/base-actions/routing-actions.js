import * as actions from './../base-action-types'
import { CHATTING_SCREEN } from 'src/redux/modules/chat/chat-screen-types'
import { isMobileBrowser } from 'utility/devices'
import { updateChatScreen } from 'src/redux/modules/chat'
import {
  getChatAvailable,
  getTalkOnline,
  getHelpCenterAvailable,
  getChannelChoiceAvailable
} from 'src/redux/modules/selectors'
import { getZopimChatEmbed } from 'src/redux/modules/base/base-selectors'
import { setScrollKiller } from 'utility/scrollHacks'
import { chat as zopimChat } from 'embed/chat/chat'

export const updateActiveEmbed = embedName => {
  return {
    type: actions.UPDATE_ACTIVE_EMBED,
    payload: embedName
  }
}

export const updateBackButtonVisibility = (visible = true) => {
  return {
    type: actions.UPDATE_BACK_BUTTON_VISIBILITY,
    payload: visible
  }
}

export const showChat = (options = { proactive: false }) => {
  return (dispatch, getState) => {
    const oldChat = getZopimChatEmbed(getState())

    if (oldChat) {
      zopimChat.show('zopimChat')
      if (isMobileBrowser()) {
        setScrollKiller(false)
      }

      dispatch(updateActiveEmbed('zopimChat'))
    } else {
      dispatch(updateActiveEmbed('chat'))
      if (options.proactive) {
        dispatch(updateChatScreen(CHATTING_SCREEN))
      }
    }
  }
}

export const onChannelChoiceNextClick = newEmbed => {
  return dispatch => {
    dispatch(updateBackButtonVisibility(true))

    if (newEmbed === 'chat') {
      dispatch(showChat())
    } else {
      dispatch(updateActiveEmbed(newEmbed))
    }
  }
}

export const onHelpCenterNextClick = () => {
  return (dispatch, getState) => {
    const state = getState()
    const chatAvailable = getChatAvailable(state)
    const oldChat = getZopimChatEmbed(state)
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
      if (!oldChat) {
        dispatch(updateBackButtonVisibility(true))
      }
    } else if (talkOnline) {
      dispatch(updateActiveEmbed('talk'))
      dispatch(updateBackButtonVisibility(true))
    } else {
      dispatch(updateActiveEmbed('ticketSubmissionForm'))
      if (helpCenterAvailable) {
        dispatch(updateBackButtonVisibility(true))
      }
    }

    dispatch({
      type: actions.NEXT_BUTTON_CLICKED
    })
  }
}
