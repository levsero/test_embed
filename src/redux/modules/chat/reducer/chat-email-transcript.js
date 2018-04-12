import {
  EMAIL_TRANSCRIPT_SUCCESS,
  EMAIL_TRANSCRIPT_FAILURE,
  EMAIL_TRANSCRIPT_REQUEST_SENT,
  EMAIL_TRANSCRIPT_IDLE,
  RESET_EMAIL_TRANSCRIPT,
  RESET_EMAIL_TRANSCRIPT_SCREEN,
  UPDATE_CHAT_EMAIL_TRANSCRIPT_VISIBILITY,
  SDK_ERROR
} from '../chat-action-types';
import {
  EMAIL_TRANSCRIPT_SUCCESS_SCREEN,
  EMAIL_TRANSCRIPT_FAILURE_SCREEN,
  EMAIL_TRANSCRIPT_SCREEN,
  EMAIL_TRANSCRIPT_LOADING_SCREEN
} from '../chat-screen-types';

const initialState = {
  screen: EMAIL_TRANSCRIPT_SCREEN,
  show: false,
  email: '',
  error: false
};

const emailTranscript = (state = initialState, action) => {
  const screenLookUp = {
    [EMAIL_TRANSCRIPT_REQUEST_SENT]: EMAIL_TRANSCRIPT_LOADING_SCREEN,
    [EMAIL_TRANSCRIPT_SUCCESS]: EMAIL_TRANSCRIPT_SUCCESS_SCREEN,
    [EMAIL_TRANSCRIPT_FAILURE]: EMAIL_TRANSCRIPT_FAILURE_SCREEN,
    [EMAIL_TRANSCRIPT_IDLE]: EMAIL_TRANSCRIPT_SCREEN
  };
  const { type, payload } = action;

  switch (type) {
    case EMAIL_TRANSCRIPT_REQUEST_SENT:
    case EMAIL_TRANSCRIPT_SUCCESS:
    case EMAIL_TRANSCRIPT_FAILURE:
    case EMAIL_TRANSCRIPT_IDLE:
      return {
        ...state,
        screen: screenLookUp[type],
        email: payload,
        error: false
      };
    case RESET_EMAIL_TRANSCRIPT_SCREEN:
      return {
        ...state,
        screen: EMAIL_TRANSCRIPT_SCREEN
      };
    case RESET_EMAIL_TRANSCRIPT:
      return initialState;
    case SDK_ERROR:
      return {
        ...state,
        screen: EMAIL_TRANSCRIPT_FAILURE_SCREEN,
        error: true
      };
    case UPDATE_CHAT_EMAIL_TRANSCRIPT_VISIBILITY:
      return {
        ...state,
        screen: EMAIL_TRANSCRIPT_SCREEN,
        show: payload
      };
    default:
      return state;
  }
};

export default emailTranscript;
