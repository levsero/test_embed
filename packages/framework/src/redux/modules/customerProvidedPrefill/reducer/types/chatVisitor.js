import { SDK_VISITOR_UPDATE } from 'src/redux/modules/chat/chat-action-types'
import { getDisplayName } from 'src/util/chat'

const initialState = {
  timestamp: 0,
  values: {},
}

const chatVisitor = (state = initialState, action) => {
  switch (action.type) {
    case SDK_VISITOR_UPDATE:
      return {
        timestamp: action.payload.timestamp,
        values: {
          ...state.values,
          name: getDisplayName(action.payload.detail?.display_name, state.name),
          email: action.payload.detail?.email,
          phone: action.payload.detail?.phone,
        },
      }
    default:
      return state
  }
}

export default chatVisitor
