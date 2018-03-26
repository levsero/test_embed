import {
  EDIT_CONTACT_DETAILS_SCREEN,
  EDIT_CONTACT_DETAILS_LOADING_SCREEN,
  EDIT_CONTACT_DETAILS_ERROR_SCREEN
} from 'constants/chat';
import {
  SET_VISITOR_INFO_REQUEST_SUCCESS,
  SET_VISITOR_INFO_REQUEST_PENDING,
  SET_VISITOR_INFO_REQUEST_FAILURE,
  UPDATE_CHAT_CONTACT_DETAILS_VISIBILITY
} from '../chat-action-types';

const initialState = {
  status: EDIT_CONTACT_DETAILS_SCREEN,
  show: false
};

const editContactDetails = (state = initialState, action) => {
  const { type, payload } = action;

  switch (type) {
    case SET_VISITOR_INFO_REQUEST_SUCCESS:
      return {
        ...state,
        status: EDIT_CONTACT_DETAILS_SCREEN,
        show: false
      };
    case SET_VISITOR_INFO_REQUEST_PENDING:
      return {
        ...state,
        status: EDIT_CONTACT_DETAILS_LOADING_SCREEN
      };
    case SET_VISITOR_INFO_REQUEST_FAILURE:
      return {
        ...state,
        status: EDIT_CONTACT_DETAILS_ERROR_SCREEN
      };
    case UPDATE_CHAT_CONTACT_DETAILS_VISIBILITY:
      return {
        ...state,
        show: payload
      };
    default:
      return state;
  }
};

export default editContactDetails;
