import { combineReducers } from 'redux';
import rootReducer from './root/reducer/root';

import base from './base/reducer';
import settings from './settings/reducer';
import chat from './chat/reducer';
import talk from './talk/reducer';
import helpCenter from './helpCenter/reducer';
import zopimChat from './zopimChat/reducer';
import submitTicket from './submitTicket/reducer';

const combinedReducers = combineReducers({
  base,
  settings,
  chat,
  talk,
  helpCenter,
  zopimChat,
  submitTicket
});

export default function reducer(state, action) {
  const initialState = combinedReducers(state, action);
  const finalState = rootReducer(initialState, action);

  return finalState;
}
