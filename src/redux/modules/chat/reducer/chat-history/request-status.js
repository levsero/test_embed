import {
  HISTORY_REQUEST_SENT,
  HISTORY_REQUEST_SUCCESS,
  HISTORY_REQUEST_FAILURE
} from '../../chat-action-types';
import { HISTORY_REQUEST_STATUS } from 'constants/chat';

const initialState = null;

const requestStatus = (state = initialState, action) => {
  switch (action.type) {
    case HISTORY_REQUEST_SENT:
      return HISTORY_REQUEST_STATUS.PENDING;
    case HISTORY_REQUEST_SUCCESS:
      return HISTORY_REQUEST_STATUS.DONE;
    case HISTORY_REQUEST_FAILURE:
      return HISTORY_REQUEST_STATUS.FAIL;
    default:
      return state;
  }
};

export default requestStatus;
