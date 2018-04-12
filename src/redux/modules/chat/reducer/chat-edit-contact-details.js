import {
  EDIT_CONTACT_DETAILS_SCREEN,
  EDIT_CONTACT_DETAILS_LOADING_SCREEN,
  EDIT_CONTACT_DETAILS_ERROR_SCREEN
} from 'constants/chat';
import {
  RESET_CONTACT_DETAILS_SCREEN,
  SET_VISITOR_INFO_REQUEST_SUCCESS,
  SET_VISITOR_INFO_REQUEST_PENDING,
  SDK_ERROR,
  UPDATE_CHAT_CONTACT_DETAILS_VISIBILITY
} from '../chat-action-types';

const initialState = {
  status: EDIT_CONTACT_DETAILS_SCREEN,
  show: false,
  display_name: '',
  email: '',
  error: false
};

const editContactDetails = (state = initialState, action) => {
  const { type, payload } = action;

  switch (type) {
    case SET_VISITOR_INFO_REQUEST_SUCCESS:
      return {
        ...state,
        status: EDIT_CONTACT_DETAILS_SCREEN,
        display_name: payload.display_name,
        email: payload.email,
        show: false,
        error: false
      };
    case SET_VISITOR_INFO_REQUEST_PENDING:
      return {
        ...state,
        status: EDIT_CONTACT_DETAILS_LOADING_SCREEN,
        display_name: payload.display_name,
        email: payload.email
      };
    case SDK_ERROR:
      return {
        ...state,
        status: EDIT_CONTACT_DETAILS_ERROR_SCREEN,
        error: true
      };
    case UPDATE_CHAT_CONTACT_DETAILS_VISIBILITY:
      return {
        ...state,
        status: EDIT_CONTACT_DETAILS_SCREEN,
        show: payload
      };
    case RESET_CONTACT_DETAILS_SCREEN:
      return {
        ...state,
        status: EDIT_CONTACT_DETAILS_SCREEN
      };
    default:
      return state;
  }
};

export default editContactDetails;
