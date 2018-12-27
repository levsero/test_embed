import { CHAT_VENDOR_LOADED, PREVIEWER_LOADED } from '../chat-action-types';
import { nullZChat } from 'src/util/nullZChat';

const initialState = {
  zChat: nullZChat,
  slider: null,
  luxon: {}
};

const vendor = (state = initialState, action = {}) => {
  const { type, payload } = action;

  switch (type) {
    case CHAT_VENDOR_LOADED:
      return { ...state, ...payload };
    case PREVIEWER_LOADED:
      return {
        ...state,
        zChat: {
          getAuthLoginUrl: () => ''
        }
      };
    default:
      return state;
  }
};

export default vendor;
