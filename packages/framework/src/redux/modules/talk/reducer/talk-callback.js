import {
  TALK_CALLBACK_REQUEST,
  TALK_CALLBACK_SUCCESS,
  TALK_CALLBACK_FAILURE,
  TALK_SUCCESS_DONE_BUTTON_CLICKED
} from '../talk-action-types'

const initialState = {
  isSending: false,
  success: false,
  error: {},
  phoneNumber: ''
}

const callback = (state = initialState, action) => {
  const { type, payload } = action

  switch (type) {
    case TALK_SUCCESS_DONE_BUTTON_CLICKED:
      return {
        ...state,
        success: initialState.success
      }
    case TALK_CALLBACK_REQUEST:
      return {
        error: {},
        phoneNumber: payload.phone,
        isSending: true,
        success: false
      }
    case TALK_CALLBACK_SUCCESS:
      return {
        error: {},
        phoneNumber: payload.phone,
        isSending: false,
        success: true
      }
    case TALK_CALLBACK_FAILURE:
      return {
        ...state,
        error: payload,
        isSending: false,
        success: false
      }
    default:
      return state
  }
}

export default callback
