import {
  SDK_ERROR,
  SET_VISITOR_INFO_REQUEST_FAILURE,
  SET_VISITOR_INFO_REQUEST_PENDING,
  SET_VISITOR_INFO_REQUEST_SUCCESS,
  UPDATE_CHAT_CONTACT_DETAILS_VISIBILITY
} from 'src/redux/modules/chat/chat-action-types'

const initialState = false

const contactDetailsSubmissionError = (state = initialState, action = {}) => {
  const { type } = action

  switch (type) {
    case SDK_ERROR:
    case SET_VISITOR_INFO_REQUEST_FAILURE:
      return true
    case SET_VISITOR_INFO_REQUEST_SUCCESS:
    case SET_VISITOR_INFO_REQUEST_PENDING:
    case UPDATE_CHAT_CONTACT_DETAILS_VISIBILITY:
      return initialState
    default:
      return state
  }
}

export default contactDetailsSubmissionError
