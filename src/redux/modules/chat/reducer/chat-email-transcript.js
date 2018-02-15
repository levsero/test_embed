import { EMAIL_TRANSCRIPT_SUCCESS,
         EMAIL_TRANSCRIPT_FAILURE,
         EMAIL_TRANSCRIPT_REQUEST_SENT,
         EMAIL_TRANSCRIPT_IDLE } from '../chat-action-types';

const initialState = {
  status: EMAIL_TRANSCRIPT_IDLE,
  email: ''
};

const emailTranscript = (state = initialState, action) => {
  switch (action.type) {
    case EMAIL_TRANSCRIPT_REQUEST_SENT:
    case EMAIL_TRANSCRIPT_SUCCESS:
    case EMAIL_TRANSCRIPT_FAILURE:
    case EMAIL_TRANSCRIPT_IDLE:
      return {
        status: action.type,
        email: action.payload
      };
    default:
      return state;
  }
};

export default emailTranscript;
