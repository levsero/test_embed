import { CHAT_VENDOR_LOADED } from '../chat-action-types';

const initialState = {
  zChat: null
};

const vendor = (state = initialState, action = {}) => {
  const { type, payload } = action;

  switch (type) {
    case CHAT_VENDOR_LOADED:
      return { ...state, ...payload };
    default:
      return state;
  }
};

export default vendor;
