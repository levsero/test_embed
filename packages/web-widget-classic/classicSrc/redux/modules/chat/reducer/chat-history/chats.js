import {
  SDK_HISTORY_CHAT_MSG,
  SDK_HISTORY_CHAT_FILE,
  SDK_HISTORY_CHAT_QUEUE_POSITION,
  SDK_HISTORY_CHAT_MEMBER_JOIN,
  SDK_HISTORY_CHAT_MEMBER_LEAVE,
  SDK_HISTORY_CHAT_REQUEST_RATING,
  SDK_HISTORY_CHAT_RATING,
  SDK_HISTORY_CHAT_COMMENT,
} from '../../chat-action-types'

const initialState = new Map()

const newEntry = (message) => {
  const timestamp = message.timestamp || Date.now()
  const map = new Map().set(timestamp, { ...message, timestamp })

  return map
}

const chats = (state = initialState, action) => {
  const { type, payload } = action
  const detail = payload && payload.detail

  switch (type) {
    case SDK_HISTORY_CHAT_FILE:
    case SDK_HISTORY_CHAT_MSG:
    case SDK_HISTORY_CHAT_QUEUE_POSITION:
    case SDK_HISTORY_CHAT_REQUEST_RATING:
    case SDK_HISTORY_CHAT_RATING:
    case SDK_HISTORY_CHAT_COMMENT:
    case SDK_HISTORY_CHAT_MEMBER_JOIN:
    case SDK_HISTORY_CHAT_MEMBER_LEAVE:
      return new Map([...newEntry(detail), ...state])
    default:
      return state
  }
}

export default chats
