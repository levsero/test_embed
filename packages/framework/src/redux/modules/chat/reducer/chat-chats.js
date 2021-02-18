import {
  SDK_CHAT_MSG,
  SDK_CHAT_FILE,
  SDK_CHAT_QUEUE_POSITION,
  SDK_CHAT_MEMBER_JOIN,
  SDK_CHAT_MEMBER_LEAVE,
  SDK_CHAT_REQUEST_RATING,
  SDK_CHAT_RATING,
  SDK_CHAT_COMMENT,
  CHAT_MSG_REQUEST_SENT,
  CHAT_MSG_REQUEST_SUCCESS,
  CHAT_MSG_REQUEST_FAILURE,
  CHAT_FILE_REQUEST_SENT,
  CHAT_FILE_REQUEST_SUCCESS,
  CHAT_FILE_REQUEST_FAILURE,
  CHAT_CONTACT_DETAILS_UPDATE_SUCCESS,
  CHAT_BANNED,
  CHAT_DROPPED,
} from '../chat-action-types'
import {
  CHAT_MESSAGE_TYPES,
  CHAT_CUSTOM_MESSAGE_EVENTS,
  CHAT_SYSTEM_EVENTS,
  CHAT_STRUCTURED_CONTENT_TYPE,
} from 'constants/chat'
import { API_RESET_WIDGET } from 'src/redux/modules/base/base-action-types'

import _ from 'lodash'

const initialState = new Map()

const concatContactDetailsUpdated = (chats, event) => {
  const copy = new Map(chats)
  const timestamp = event.timestamp
  const contactDetailsUpdated = {
    timestamp: timestamp,
    type: CHAT_SYSTEM_EVENTS.CHAT_EVENT_CONTACT_DETAILS_UPDATED,
  }

  return copy.set(timestamp, contactDetailsUpdated)
}

const concatChat = (chats, chat) => {
  const copy = new Map(chats)
  const timestamp = chat.timestamp

  return copy.set(timestamp, { ...chat, timestamp })
}

const concatQuickReply = (chats, chat) => {
  const copy = new Map(chats)
  const timestamp = chat.timestamp
  const quickReplies = {
    type: CHAT_CUSTOM_MESSAGE_EVENTS.CHAT_QUICK_REPLIES,
    nick: chat.nick,
    items: chat.structured_msg.quick_replies,
    timestamp: timestamp + 1,
  }

  copy.set(timestamp, chat)
  copy.set(timestamp + 1, quickReplies)

  return copy
}

const updateChat = (chats, chat) => {
  const copy = new Map(chats),
    prevChat = chats.get(chat.detail.timestamp)

  const numFailedTries =
    (_.get(chat, 'status') === CHAT_MESSAGE_TYPES.CHAT_MESSAGE_FAILURE || 0) +
    _.get(prevChat, 'numFailedTries', 0)

  return copy.set(chat.detail.timestamp, {
    ...prevChat,
    ...chat.detail,
    status: chat.status,
    numFailedTries,
  })
}

const chats = (state = initialState, action) => {
  switch (action.type) {
    case CHAT_MSG_REQUEST_SUCCESS:
    case CHAT_MSG_REQUEST_FAILURE:
    case CHAT_MSG_REQUEST_SENT:
      return updateChat(state, action.payload)
    case CHAT_FILE_REQUEST_SENT:
    case CHAT_FILE_REQUEST_SUCCESS:
    case CHAT_FILE_REQUEST_FAILURE:
    case SDK_CHAT_QUEUE_POSITION:
    case SDK_CHAT_REQUEST_RATING:
    case SDK_CHAT_RATING:
    case SDK_CHAT_COMMENT:
    case SDK_CHAT_MEMBER_JOIN:
    case SDK_CHAT_MEMBER_LEAVE:
    case SDK_CHAT_FILE:
      return concatChat(state, action.payload.detail)
    case SDK_CHAT_MSG:
      const { detail } = action.payload

      if (
        detail.structured_msg &&
        detail.structured_msg.type === CHAT_STRUCTURED_CONTENT_TYPE.QUICK_REPLIES
      ) {
        return concatQuickReply(state, detail)
      }

      return concatChat(state, detail)
    case CHAT_CONTACT_DETAILS_UPDATE_SUCCESS:
      return concatContactDetailsUpdated(state, action.payload)
    case API_RESET_WIDGET:
    case CHAT_DROPPED:
    case CHAT_BANNED:
      return initialState
    default:
      return state
  }
}

export default chats
