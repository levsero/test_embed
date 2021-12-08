import { SET_VISITOR_INFO_REQUEST_SUCCESS } from 'classicSrc/redux/modules/chat/chat-action-types'

const initialState = {
  timestamp: 0,
  values: {},
}

const identify = (state = initialState, action) => {
  switch (action.type) {
    case SET_VISITOR_INFO_REQUEST_SUCCESS:
      return {
        timestamp: action.payload.timestamp,
        values: {
          ...(state.values || {}),
          ...action.payload,
        },
      }
    default:
      return state
  }
}

export default identify
