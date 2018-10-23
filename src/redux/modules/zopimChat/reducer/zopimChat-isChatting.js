import { ZOPIM_IS_CHATTING, ZOPIM_END_CHAT } from '../zopimChat-action-types';

const initialState = false;
const isChatting = (state = initialState, action) => {
  switch (action.type) {
    case ZOPIM_IS_CHATTING:
      return true;
    case ZOPIM_END_CHAT:
      return false;
    default:
      return state;
  }
};

export default isChatting;
