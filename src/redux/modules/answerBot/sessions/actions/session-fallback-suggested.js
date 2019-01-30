import { SESSION_FALLBACK } from '../action-types';

import {
  getCurrentSessionID
} from 'src/redux/modules/answerBot/root/selectors';

export const sessionFallback = () => {
  return (dispatch, getState) => {
    dispatch({
      type: SESSION_FALLBACK,
      payload: {
        sessionID: getCurrentSessionID(getState())
      }
    });
  };
};
