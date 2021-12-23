import {
  getChatStatus,
  getActiveAgentCount,
  getChatOnline,
  getActiveAgents,
} from 'classicSrc/embeds/chat/selectors'
import { endChat } from 'classicSrc/redux/modules/chat'
import {
  SDK_CHAT_MEMBER_LEAVE,
  CHAT_AGENT_INACTIVE,
} from 'classicSrc/redux/modules/chat/chat-action-types'
import _ from 'lodash'

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
