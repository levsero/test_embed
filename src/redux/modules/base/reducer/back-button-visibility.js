import { UPDATE_BACK_BUTTON_VISIBILITY } from '../base-action-types';
import { GET_ARTICLE_REQUEST_SUCCESS } from 'src/redux/modules/helpCenter/helpCenter-action-types';
import { TICKET_SUBMISSION_REQUEST_SUCCESS } from 'src/redux/modules/submitTicket/submitTicket-action-types';

const initialState = false;

const backButtonVisible = (state = initialState, action) => {
  const { type, payload } = action;

  switch (type) {
    case UPDATE_BACK_BUTTON_VISIBILITY:
      return payload;
    case GET_ARTICLE_REQUEST_SUCCESS:
    case TICKET_SUBMISSION_REQUEST_SUCCESS:
      return false;
    default:
      return state;
  }
};

export default backButtonVisible;
