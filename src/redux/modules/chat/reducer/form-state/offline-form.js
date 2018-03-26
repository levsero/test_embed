import { CHAT_OFFLINE_FORM_CHANGED, OFFLINE_FORM_BACK_BUTTON_CLICKED } from '../../chat-action-types';
import { IDENTIFY_RECIEVED } from '../../../base/base-action-types';

const initialState = {};

const offlineForm = (state = initialState, action) => {
  switch (action.type) {
    case CHAT_OFFLINE_FORM_CHANGED:
      return action.payload;
    case IDENTIFY_RECIEVED:
      return { ...state, ...action.payload };
    case OFFLINE_FORM_BACK_BUTTON_CLICKED:
      return { ...state, message: '' };
    default:
      return state;
  }
};

export default offlineForm;
