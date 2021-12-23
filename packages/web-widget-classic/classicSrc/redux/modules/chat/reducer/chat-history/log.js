import _ from 'lodash'
import {
  SDK_HISTORY_CHAT_MSG,
  SDK_HISTORY_CHAT_FILE,
  SDK_HISTORY_CHAT_MEMBER_JOIN,
  SDK_HISTORY_CHAT_MEMBER_LEAVE,
  SDK_HISTORY_CHAT_REQUEST_RATING,
  SDK_HISTORY_CHAT_RATING,
  SDK_HISTORY_CHAT_COMMENT,
  HISTORY_REQUEST_SUCCESS,
} from '../../chat-action-types'

// History messages are appended to this log in batches to avoid janky re-rendering.
// Messages are added to the `buffer` array as they are received from the SDK firehose.

// When the `HISTORY_REQUEST_SUCCESS` action is dispatched, the contents of the `buffer` array
// are appended to the `entries` array, and the `buffer` array is emptied.

const initialState = {
  entries: [],
  buffer: [],
}

const newGroup = (message, type) => ({
  type,
  author: message.nick || 'system',
  first: !!message.first,
  messages: [message.timestamp],
})

const log = (state = initialState, action) => {
  switch (action.type) {
    case SDK_HISTORY_CHAT_FILE:
    case SDK_HISTORY_CHAT_MSG:
      const message = action.payload.detail
      const bufferCopy = [...state.buffer]
      const lastGroup = _.last(bufferCopy)

      if (lastGroup && lastGroup.type === 'message' && lastGroup.author === message.nick) {
        lastGroup.messages.push(message.timestamp)
        return {
          ...state,
          buffer: bufferCopy,
        }
      }

      return {
        ...state,
        buffer: [...state.buffer, newGroup(message, 'message')],
      }
    case SDK_HISTORY_CHAT_REQUEST_RATING:
    case SDK_HISTORY_CHAT_RATING:
    case SDK_HISTORY_CHAT_COMMENT:
    case SDK_HISTORY_CHAT_MEMBER_JOIN:
    case SDK_HISTORY_CHAT_MEMBER_LEAVE:
      return {
        ...state,
        buffer: [...state.buffer, newGroup(action.payload.detail, 'event')],
      }
    case HISTORY_REQUEST_SUCCESS:
      return {
        entries: [...state.buffer, ...state.entries], // TODO: merge boundary groups when buffer is flushed
        buffer: [],
      }
    default:
      return state
  }
}

export default log
