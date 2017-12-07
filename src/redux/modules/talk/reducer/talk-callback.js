import { TALK_CALLBACK_REQUEST, TALK_CALLBACK_SUCCESS, TALK_CALLBACK_FAILURE } from '../talk-action-types';

const initialState = {
  isSending: false,
  error: {},
  phoneNumber: ''
};

const callback = (state = initialState, action) => {
  const { type, payload } = action;

  switch (type) {
    case TALK_CALLBACK_REQUEST:
      return {
        error: {},
        phoneNumber: payload.phone,
        isSending: true
      };
    case TALK_CALLBACK_SUCCESS:
      return {
        error: {},
        phoneNumber: payload.phone,
        isSending: false
      };
    case TALK_CALLBACK_FAILURE:
      return {
        ...state,
        error: payload,
        isSending: false
      };
    default:
      return state;
  }
};

export default callback;
