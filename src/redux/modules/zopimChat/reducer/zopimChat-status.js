import { ZOPIM_CHAT_ON_STATUS_UPDATE } from '../zopimChat-action-types';

const initialState = '';

const status = (state = initialState, action) => {
  switch (action.type) {
    case ZOPIM_CHAT_ON_STATUS_UPDATE:
      return action.payload || state;
    default:
      return state;
  }
};

export default status;
