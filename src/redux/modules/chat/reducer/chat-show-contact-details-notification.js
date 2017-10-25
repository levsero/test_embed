import { TOGGLE_CONTACT_DETAILS_NOTIFICATION } from '../chat-action-types';

const initialState = false;

const showContactDetailsNotification = (state = initialState, action) => {
  const { type, payload } = action;

  switch (type) {
    case TOGGLE_CONTACT_DETAILS_NOTIFICATION:
      return payload;
    default:
      return state;
  }
};

export default showContactDetailsNotification;
