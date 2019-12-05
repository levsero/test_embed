import _ from 'lodash'

import { getDelayChatConnection } from 'src/redux/modules/selectors/chat-linked-selectors'
import { setUpChat } from 'src/redux/modules/chat'
import {
  LAUNCHER_CLICKED,
  OPEN_RECEIVED,
  ACTIVATE_RECEIVED,
  TOGGLE_RECEIVED,
  CHAT_BADGE_CLICKED
} from 'src/redux/modules/base/base-action-types'
import { getChatEmbed } from 'src/redux/modules/base/base-selectors'

let setupChatCalled = false

export default function onChatConnectOnDemandTrigger(state, action, dispatch) {
  if (!getDelayChatConnection(state)) return

  const actionsToTrigger = [
    CHAT_BADGE_CLICKED,
    LAUNCHER_CLICKED,
    OPEN_RECEIVED,
    ACTIVATE_RECEIVED,
    TOGGLE_RECEIVED
  ]
  const chatEnabled = getChatEmbed(state)

  if (chatEnabled && !setupChatCalled && _.includes(actionsToTrigger, action.type)) {
    dispatch(setUpChat(false))
    setupChatCalled = true
  }
}
