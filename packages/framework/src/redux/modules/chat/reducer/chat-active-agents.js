import {
  SDK_CHAT_MEMBER_JOIN,
  SDK_CHAT_TYPING,
  SDK_AGENT_UPDATE,
  SDK_CHAT_MEMBER_LEAVE,
  END_CHAT_REQUEST_SUCCESS,
  CHAT_RECONNECT,
  CHAT_DROPPED
} from '../chat-action-types'

const initialState = new Map()

const isAgent = nick => nick.indexOf('agent:') > -1

const addAgent = (agents, nickname, data) => {
  const copy = new Map(agents)

  copy.set(nickname, { ...data })
  return copy
}

const updateAgent = (agents, nickname, data) => {
  const copy = new Map(agents),
    prevAgent = agents.get(nickname)

  if (prevAgent) {
    copy.set(nickname, { ...prevAgent, ...data })
  }
  return copy
}

const removeAgent = (agents, nickname) => {
  const copy = new Map(agents)

  copy.delete(nickname)
  return copy
}

const activeAgents = (state = initialState, action = {}) => {
  const { type, payload } = action

  switch (type) {
    case SDK_CHAT_MEMBER_JOIN:
      if (isAgent(payload.detail.nick)) {
        return addAgent(state, payload.detail.nick, {
          nick: payload.detail.nick
        })
      }
      return state
    case SDK_CHAT_TYPING:
      return updateAgent(state, payload.detail.nick, {
        typing: payload.detail.typing
      })
    case SDK_AGENT_UPDATE:
      const { nick: nickname } = payload.detail
      const typing = !!(state[nickname] && state[nickname].typing)

      return updateAgent(state, payload.detail.nick, {
        ...payload.detail,
        nick: payload.detail.nick,
        typing
      })
    case SDK_CHAT_MEMBER_LEAVE:
      if (isAgent(payload.detail.nick)) {
        return removeAgent(state, payload.detail.nick)
      } else {
        return initialState // visitor has left implying chat session has ended.
      }
    case END_CHAT_REQUEST_SUCCESS:
    case CHAT_RECONNECT:
    case CHAT_DROPPED:
      return initialState
    default:
      return state
  }
}

export default activeAgents
