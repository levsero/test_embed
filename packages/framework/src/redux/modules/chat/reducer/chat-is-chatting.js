import _ from 'lodash'
import {
  UPDATE_PREVIEWER_SCREEN,
  CHAT_MSG_REQUEST_SUCCESS,
  CHAT_USER_LOGGING_OUT,
  END_CHAT_REQUEST_SUCCESS,
  CHAT_BANNED,
  IS_CHATTING,
  SDK_CONNECTION_UPDATE,
  SDK_CHAT_MEMBER_JOIN,
} from '../chat-action-types'
import { store } from 'src/framework/services/persistence'

const initialState = _.get(store.get('store'), 'is_chatting', false)

const isChatting = (state = initialState, { payload, type }) => {
  switch (type) {
    case IS_CHATTING:
      return payload
    case UPDATE_PREVIEWER_SCREEN:
      return payload.status
    case CHAT_MSG_REQUEST_SUCCESS:
    case SDK_CHAT_MEMBER_JOIN:
      return true
    case SDK_CONNECTION_UPDATE:
      if (payload.type === 'connection_update' && payload.detail === 'closed') return false
      return state
    case CHAT_BANNED:
    case END_CHAT_REQUEST_SUCCESS:
    case CHAT_USER_LOGGING_OUT:
      return false
    default:
      return state
  }
}

export default isChatting
