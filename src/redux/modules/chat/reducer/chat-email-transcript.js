import { EMAIL_TRANSCRIPT_SUCCESS,
         EMAIL_TRANSCRIPT_FAILURE,
         EMAIL_TRANSCRIPT_REQUEST_SENT,
         EMAIL_TRANSCRIPT_IDLE,
         RESET_EMAIL_TRANSCRIPT } from '../chat-action-types';
import {
  EMAIL_TRANSCRIPT_SUCCESS_SCREEN,
  EMAIL_TRANSCRIPT_FAILURE_SCREEN,
  EMAIL_TRANSCRIPT_SCREEN,
  EMAIL_TRANSCRIPT_LOADING_SCREEN
} from '../chat-screen-types';

const initialState = {
  screen: EMAIL_TRANSCRIPT_SCREEN,
  email: ''
};

const emailTranscript = (state = initialState, action) => {
  const screenLookUp = {
    [EMAIL_TRANSCRIPT_REQUEST_SENT]: EMAIL_TRANSCRIPT_LOADING_SCREEN,
    [EMAIL_TRANSCRIPT_SUCCESS]: EMAIL_TRANSCRIPT_SUCCESS_SCREEN,
    [EMAIL_TRANSCRIPT_FAILURE]: EMAIL_TRANSCRIPT_FAILURE_SCREEN,
    [EMAIL_TRANSCRIPT_IDLE]: EMAIL_TRANSCRIPT_SCREEN
  };

  switch (action.type) {
    case EMAIL_TRANSCRIPT_REQUEST_SENT:
    case EMAIL_TRANSCRIPT_SUCCESS:
    case EMAIL_TRANSCRIPT_FAILURE:
    case EMAIL_TRANSCRIPT_IDLE:
      return {
        screen: screenLookUp[action.type],
        email: action.payload
      };
    case RESET_EMAIL_TRANSCRIPT:
      return {
        screen: EMAIL_TRANSCRIPT_SCREEN,
        email: ''
      };
    default:
      return state;
  }
};

export default emailTranscript;
