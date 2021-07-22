import _ from 'lodash'
import {
  LAUNCHER_CLICKED,
  OPEN_RECEIVED,
  ACTIVATE_RECEIVED,
  TOGGLE_RECEIVED,
  CHAT_BADGE_CLICKED,
  WIDGET_SHOW_ANIMATION_COMPLETE,
} from 'src/redux/modules/base/base-action-types'
import { getChatEmbed } from 'src/redux/modules/base/base-selectors'
import { setUpChat } from 'src/redux/modules/chat'
import { getDelayChatConnection } from 'src/redux/modules/selectors/chat-linked-selectors'

let setupChatCalled = false

export default function onChatConnectOnDemandTrigger(state, action, dispatch) {
  if (!getDelayChatConnection(state)) return

  const actionsToTrigger = [
    CHAT_BADGE_CLICKED,
    LAUNCHER_CLICKED,
    OPEN_RECEIVED,
    ACTIVATE_RECEIVED,
    TOGGLE_RECEIVED,
    WIDGET_SHOW_ANIMATION_COMPLETE,
  ]
  const chatEnabled = getChatEmbed(state)

  if (chatEnabled && !setupChatCalled && _.includes(actionsToTrigger, action.type)) {
    dispatch(setUpChat(false))
    setupChatCalled = true
  }
}
