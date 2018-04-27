import {
  HISTORY_REQUEST_SENT,
  HISTORY_REQUEST_SUCCESS,
  HISTORY_REQUEST_FAILURE
} from '../../chat-action-types';

const initialState = null;

const requestStatus = (state = initialState, action) => {
  switch (action.type) {
    case HISTORY_REQUEST_SENT:
      return 'pending';
    case HISTORY_REQUEST_SUCCESS:
      return 'done';
    case HISTORY_REQUEST_FAILURE:
      return 'fail';
    default:
      return state;
  }
};

export default requestStatus;
