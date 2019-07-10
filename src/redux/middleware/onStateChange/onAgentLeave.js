import _ from 'lodash'

import {
  SDK_CHAT_MEMBER_LEAVE,
  CHAT_AGENT_INACTIVE
} from 'src/redux/modules/chat/chat-action-types'
import { getChatOnline, getActiveAgents } from 'src/redux/modules/chat/chat-selectors'
import { endChat } from 'src/redux/modules/chat'

export default (prevState, nextState, { type, payload }, dispatch) => {
  const memberLeaveEvent = type === SDK_CHAT_MEMBER_LEAVE
  const isAgent = _.get(payload, 'detail.nick', '').indexOf('agent:') > -1

  if (memberLeaveEvent && isAgent) {
    const prevAgents = getActiveAgents(prevState)
    const agents = getActiveAgents(nextState)
    const chatOnline = getChatOnline(nextState)

    if (_.size(agents) === 0 && !chatOnline) {
      dispatch(endChat())
    } else {
      dispatch({
        type: CHAT_AGENT_INACTIVE,
        payload: prevAgents[payload.detail.nick]
      })
    }
  }
}
