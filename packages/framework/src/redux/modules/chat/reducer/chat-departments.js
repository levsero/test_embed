import { SDK_DEPARTMENT_UPDATE } from '../chat-action-types'
import { RECEIVE_DEFERRED_CHAT_STATUS } from 'src/embeds/chat/actions/action-types'

const initialState = {}

const departments = (state = initialState, action) => {
  const { type, payload } = action

  switch (type) {
    case SDK_DEPARTMENT_UPDATE:
      return {
        ...state,
        [payload.detail.id]: {
          ...state[payload.detail.id],
          ...payload.detail,
        },
      }
    case RECEIVE_DEFERRED_CHAT_STATUS:
      return {
        ...state,
        ...(action.payload.departments || {}),
      }
    default:
      return state
  }
}

export default departments
