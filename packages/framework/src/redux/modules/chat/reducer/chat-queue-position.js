import { CONNECTION_STATUSES } from 'constants/chat'
import { SDK_CHAT_QUEUE_POSITION, SDK_CONNECTION_UPDATE } from '../chat-action-types'

const initialState = 0

const queuePosition = (state = initialState, action = {}) => {
  const { type, payload } = action

  switch (type) {
    case SDK_CHAT_QUEUE_POSITION:
      return payload.detail.queue_position
    case SDK_CONNECTION_UPDATE:
      if (payload.type === 'connection_update' && payload.detail === CONNECTION_STATUSES.CLOSED) {
        return initialState
      }
      return state
    default:
      return state
  }
}

export default queuePosition
