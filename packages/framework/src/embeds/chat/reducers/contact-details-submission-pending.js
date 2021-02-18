import {
  SDK_ERROR,
  SET_VISITOR_INFO_REQUEST_FAILURE,
  SET_VISITOR_INFO_REQUEST_PENDING,
  SET_VISITOR_INFO_REQUEST_SUCCESS,
  UPDATE_CHAT_CONTACT_DETAILS_VISIBILITY,
} from 'src/redux/modules/chat/chat-action-types'

const initialState = false

const contactDetailsSubmissionPending = (state = initialState, action = {}) => {
  const { type } = action

  switch (type) {
    case SET_VISITOR_INFO_REQUEST_PENDING:
      return true
    case SDK_ERROR:
    case UPDATE_CHAT_CONTACT_DETAILS_VISIBILITY:
    case SET_VISITOR_INFO_REQUEST_FAILURE:
    case SET_VISITOR_INFO_REQUEST_SUCCESS:
      return initialState

    default:
      return state
  }
}

export default contactDetailsSubmissionPending
