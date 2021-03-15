import _ from 'lodash'
import { combineReducers } from 'redux'
import {
  SDK_CHAT_MSG,
  SDK_CHAT_FILE,
  SDK_CHAT_MEMBER_JOIN,
  SDK_CHAT_MEMBER_LEAVE,
  SDK_CHAT_REQUEST_RATING,
  SDK_CHAT_RATING,
  SDK_CHAT_COMMENT,
  CHAT_CONTACT_DETAILS_UPDATE_SUCCESS,
  CHAT_MSG_REQUEST_SENT,
  CHAT_FILE_REQUEST_SENT,
  CHAT_BANNED,
  CHAT_DROPPED,
  CHAT_LAST_CHAT_RATING_REQUEST_COMPLETE,
  END_CHAT_REQUEST_SUCCESS,
} from '../chat-action-types'
import { CHAT_STRUCTURED_CONTENT_TYPE } from 'constants/chat'
import { API_RESET_WIDGET } from 'src/redux/modules/base/base-action-types'
import { CHAT_RATING_REQUEST_SUCCESS } from 'src/redux/modules/chat/chat-action-types'
import { store } from 'src/framework/services/persistence'
import { isAgent } from 'src/util/chat'

const UNSET_TIMESTAMP = -1
const initialState = {
  firstVisitorMessage: UNSET_TIMESTAMP,
  latestRating: UNSET_TIMESTAMP,
  latestRatingRequest: UNSET_TIMESTAMP,
  latestQuickReply: UNSET_TIMESTAMP,
  latestAgentLeaveEvent: UNSET_TIMESTAMP,
  lastMessageAuthor: '',
  groups: [],
}

const firstVisitorMessage = (state = initialState.firstVisitorMessage, action) => {
  switch (action.type) {
    case CHAT_MSG_REQUEST_SENT:
    case CHAT_FILE_REQUEST_SENT:
      return state === initialState.firstVisitorMessage ? action.payload.detail.timestamp : state
    case API_RESET_WIDGET:
    case CHAT_BANNED:
    case CHAT_DROPPED:
      return initialState.firstVisitorMessage
    default:
      return state
  }
}

const latestRating = (state = initialState.latestRating, action) => {
  switch (action.type) {
    case SDK_CHAT_RATING:
      return action.payload.detail.timestamp
    case API_RESET_WIDGET:
    case CHAT_BANNED:
    case CHAT_DROPPED:
    case END_CHAT_REQUEST_SUCCESS:
    case CHAT_LAST_CHAT_RATING_REQUEST_COMPLETE:
      return initialState.latestRating
    // If visitor has rated during chat, `latestAgentLeaveEvent` will not be reset
    // after agent ends the chat. We will reset it using SDK_CHAT_MEMBER_JOIN to
    // hide rating button
    case SDK_CHAT_MEMBER_JOIN:
      const isLastChatRatingEnabled = _.get(store.get('arturos'), 'webWidgetEnableLastChatRating')
      if (isLastChatRatingEnabled && !isAgent(action.payload.detail.nick)) {
        return initialState.latestRating
      }
      return state
    default:
      return state
  }
}

const latestRatingRequest = (state = initialState.latestRatingRequest, action) => {
  switch (action.type) {
    case SDK_CHAT_REQUEST_RATING:
      return action.payload.detail.timestamp
    case API_RESET_WIDGET:
    case CHAT_BANNED:
    case CHAT_DROPPED:
    case CHAT_RATING_REQUEST_SUCCESS:
      return initialState.latestRatingRequest
    default:
      return state
  }
}

const latestQuickReply = (state = initialState.latestQuickReply, action) => {
  switch (action.type) {
    case SDK_CHAT_MSG:
      const { structured_msg: structMsg, timestamp } = action.payload.detail

      return structMsg && structMsg.type === CHAT_STRUCTURED_CONTENT_TYPE.QUICK_REPLIES
        ? timestamp + 1
        : UNSET_TIMESTAMP
    case CHAT_MSG_REQUEST_SENT:
    case CHAT_FILE_REQUEST_SENT:
    case SDK_CHAT_FILE:
    case SDK_CHAT_REQUEST_RATING:
    case SDK_CHAT_RATING:
    case SDK_CHAT_COMMENT:
    case CHAT_CONTACT_DETAILS_UPDATE_SUCCESS:
      return UNSET_TIMESTAMP
    case API_RESET_WIDGET:
    case CHAT_BANNED:
    case CHAT_DROPPED:
      return initialState.latestQuickReply
    default:
      return state
  }
}

const latestAgentLeaveEvent = (state = initialState.latestAgentLeaveEvent, action) => {
  switch (action.type) {
    case SDK_CHAT_MEMBER_LEAVE:
      return action.payload.detail.nick.indexOf('agent') > -1
        ? action.payload.detail.timestamp
        : state
    case API_RESET_WIDGET:
    case CHAT_BANNED:
    case CHAT_DROPPED:
    case END_CHAT_REQUEST_SUCCESS:
    case CHAT_LAST_CHAT_RATING_REQUEST_COMPLETE:
      return initialState.latestAgentLeaveEvent
    // If visitor rates during chat after agent ends the chat, `latestAgentLeaveEvent`
    // is not reset. We will reset it using SDK_CHAT_MEMBER_JOIN to hide rating
    // button
    case SDK_CHAT_MEMBER_JOIN:
      const isLastChatRatingEnabled = _.get(store.get('arturos'), 'webWidgetEnableLastChatRating')
      if (isLastChatRatingEnabled && !isAgent(action.payload.detail.nick)) {
        return initialState.latestAgentLeaveEvent
      }
      return state
    default:
      return state
  }
}

const lastMessageAuthor = (state = initialState.lastMessageAuthor, action) => {
  switch (action.type) {
    case CHAT_MSG_REQUEST_SENT:
    case CHAT_FILE_REQUEST_SENT:
    case SDK_CHAT_FILE:
    case SDK_CHAT_MSG:
      return action.payload.detail.nick
    case API_RESET_WIDGET:
    case CHAT_BANNED:
    case CHAT_DROPPED:
      return initialState.lastMessageAuthor
    default:
      return state
  }
}

const newGroup = (message, type) => ({
  type,
  author: message.nick || 'system',
  messages: [message.timestamp],
})

const groups = (state = initialState.groups, action) => {
  switch (action.type) {
    case CHAT_MSG_REQUEST_SENT:
    case CHAT_FILE_REQUEST_SENT:
    case SDK_CHAT_FILE:
    case SDK_CHAT_MSG:
      const message = action.payload.detail
      const groupsCopy = [...state]
      const lastGroup = _.last(groupsCopy)

      if (lastGroup && lastGroup.type === 'message' && lastGroup.author === message.nick) {
        lastGroup.messages.push(message.timestamp)
        return groupsCopy
      }

      return [...state, newGroup(message, 'message')]
    case SDK_CHAT_REQUEST_RATING:
    case SDK_CHAT_RATING:
    case SDK_CHAT_COMMENT:
    case SDK_CHAT_MEMBER_JOIN:
    case SDK_CHAT_MEMBER_LEAVE:
      return [...state, newGroup(action.payload.detail, 'event')]
    case CHAT_CONTACT_DETAILS_UPDATE_SUCCESS:
      return [...state, newGroup(action.payload, 'event')]
    case API_RESET_WIDGET:
    case CHAT_BANNED:
    case CHAT_DROPPED:
      return initialState.groups
    default:
      return state
  }
}

const chatLogReducer = combineReducers({
  firstVisitorMessage,
  latestRating,
  latestRatingRequest,
  latestQuickReply,
  latestAgentLeaveEvent,
  lastMessageAuthor,
  groups,
})

export default chatLogReducer
