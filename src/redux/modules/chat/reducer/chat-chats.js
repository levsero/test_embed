import SortedMap from 'collections/sorted-map';

import {
  SENT_CHAT_MSG_REQUEST,
  SENT_CHAT_MSG_SUCCESS,
  SENT_CHAT_MSG_FAILURE
} from '../chat-action-types';

const initialState = new SortedMap();

const chats  = (state = initialState, action) => {
  switch (action.type) {
    case SENT_CHAT_MSG_SUCCESS:
      return state.concat({
        [action.payload.detail.timestamp]: action.payload.detail
      });
    default:
      return state;
  }
}

export default chats;
