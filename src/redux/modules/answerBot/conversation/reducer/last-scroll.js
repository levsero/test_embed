import { CONVERSATION_SCROLL_CHANGED } from '../action-types';

const initialState = 0;

const lastScroll = (state = initialState, action) => {
  switch (action.type) {
    case CONVERSATION_SCROLL_CHANGED:
      return action.payload;
    default:
      return state;
  }
};

export default lastScroll;
