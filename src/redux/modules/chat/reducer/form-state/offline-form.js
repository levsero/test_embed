import { CHAT_OFFLINE_FORM_CHANGED } from '../../chat-action-types';

const initialState = {};

const offlineForm = (state = initialState, action) => {
  switch (action.type) {
    case CHAT_OFFLINE_FORM_CHANGED:
      return action.payload;
    default:
      return state;
  }
};

export default offlineForm;
