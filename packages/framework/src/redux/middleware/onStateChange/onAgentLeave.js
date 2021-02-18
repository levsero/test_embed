import _ from 'lodash'

import {
  SDK_CHAT_MEMBER_LEAVE,
  CHAT_AGENT_INACTIVE,
} from 'src/redux/modules/chat/chat-action-types'
import { getChatOnline, getActiveAgents } from 'src/redux/modules/chat/chat-selectors'
import { endChat } from 'src/redux/modules/chat'
import { getChatStatus, getActiveAgentCount } from 'src/redux/modules/chat/chat-selectors'

export default (prevState, nextState, { type, payload }, dispatch) => {
  if (_.isEmpty(getChatStatus(nextState))) return

  const memberLeaveEvent = type === SDK_CHAT_MEMBER_LEAVE
  const isAgent = _.get(payload, 'detail.nick', '').indexOf('agent:') > -1

  if (memberLeaveEvent && isAgent) {
    const prevAgents = getActiveAgents(prevState)
    const agentCount = getActiveAgentCount(nextState)
    const chatOnline = getChatOnline(nextState)

    if (agentCount === 0 && !chatOnline) {
      dispatch(endChat())
    } else {
      dispatch({
        type: CHAT_AGENT_INACTIVE,
        payload: prevAgents[payload.detail.nick],
      })
    }
  }
}
