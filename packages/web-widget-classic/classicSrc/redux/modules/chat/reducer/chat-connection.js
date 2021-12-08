import { CONNECTION_STATUSES } from 'classicSrc/constants/chat'
import { SDK_CONNECTION_UPDATE, CHAT_CONNECTION_ERROR, CHAT_BANNED } from '../chat-action-types'

const initialState = ''

const connection = (state = initialState, action) => {
  switch (action.type) {
    case SDK_CONNECTION_UPDATE:
      return action.payload.detail
    case CHAT_CONNECTION_ERROR:
    case CHAT_BANNED:
      return CONNECTION_STATUSES.CLOSED
    default:
      return state
  }
}

export default connection
