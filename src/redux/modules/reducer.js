import { combineReducers } from 'redux';
import rootReducer from './root/reducer/root';

import base from './base/reducer';
import chat from './chat/reducer';

const combinedReducers = combineReducers({
  base,
  chat
});

export default function reducer(state, action) {
  const initialState = combinedReducers(state, action);
  const finalState = rootReducer(initialState, action);

  return finalState;
}
