import _ from 'lodash'

import { getSettingsChatConnectOnDemand } from 'src/redux/modules/settings/settings-selectors'
import { setUpChat } from 'src/redux/modules/chat'
import {
  LAUNCHER_CLICKED,
  OPEN_RECEIVED,
  ACTIVATE_RECEIVED
} from 'src/redux/modules/base/base-action-types'
import { getChatEmbed } from 'src/redux/modules/base/base-selectors'

let setupChatCalled = false

export default function onChatConnectOnDemandTrigger(state, action, dispatch) {
  if (!getSettingsChatConnectOnDemand(state)) return

  const actionsToTrigger = [LAUNCHER_CLICKED, OPEN_RECEIVED, ACTIVATE_RECEIVED]
  const chatEnabled = getChatEmbed(state)

  if (chatEnabled && !setupChatCalled && _.includes(actionsToTrigger, action.type)) {
    dispatch(setUpChat())
    setupChatCalled = true
  }
}
