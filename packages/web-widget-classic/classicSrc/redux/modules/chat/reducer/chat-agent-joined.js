import { AGENT_BOT } from 'classicSrc/constants/chat'
import {
  SDK_CHAT_MEMBER_JOIN,
  END_CHAT_REQUEST_SUCCESS,
  SDK_CHAT_MEMBER_LEAVE,
} from '../chat-action-types'

const initialState = false

const isAgent = (nick) => nick.indexOf('agent:') > -1 && nick !== AGENT_BOT

const agentJoined = (state = initialState, action) => {
  switch (action.type) {
    case SDK_CHAT_MEMBER_JOIN:
      if (isAgent(action.payload.detail.nick)) {
        return true
      }
      return state
    case SDK_CHAT_MEMBER_LEAVE:
      if (!isAgent(action.payload.detail.nick)) {
        return initialState
      }
      return state
    case END_CHAT_REQUEST_SUCCESS:
      return initialState
    default:
      return state
  }
}

export default agentJoined
