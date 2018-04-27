import { HISTORY_REQUEST_SUCCESS } from '../../chat-action-types';

const initialState = false;

const hasMore = (state = initialState, action) => {
  switch (action.type) {
    case HISTORY_REQUEST_SUCCESS:
      return action.payload.has_more;
    default:
      return state;
  }
};

export default hasMore;
