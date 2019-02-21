import { PREVIEWER_LOADED } from '../../chat/chat-action-types';

const initialState = false;

const enabled = (state = initialState, action) => {
  switch (action.type) {
    case PREVIEWER_LOADED:
      return true;
    default:
      return state;
  }
};

export default enabled;
