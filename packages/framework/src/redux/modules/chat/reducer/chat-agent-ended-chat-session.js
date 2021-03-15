import { SDK_CHAT_MEMBER_LEAVE, SDK_CHAT_MEMBER_JOIN } from '../chat-action-types'
import { SDK_CHAT_REASON } from 'constants/chat'
import { isAgent } from 'src/util/chat'

const initialState = false

const isAgentEndedChatSession = (reason) => reason === SDK_CHAT_REASON.AGENT_ENDS_CHAT

const agentEndedChatSession = (state = initialState, action) => {
  switch (action.type) {
    case SDK_CHAT_MEMBER_LEAVE:
      // If check is required as state could be true if isAgentEndedChatSession returns false
      if (isAgentEndedChatSession(action.payload.detail.reason)) {
        return true
      }
      return state
    case SDK_CHAT_MEMBER_JOIN:
      if (!isAgent(action.payload.detail.nick)) return initialState
      return state
    default:
      return state
  }
}

export default agentEndedChatSession
