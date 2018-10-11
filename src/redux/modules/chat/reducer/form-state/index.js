import { combineReducers } from 'redux';

import offlineForm from './offline-form';
import preChatForm from './prechat-form';
import readOnlyState from './readOnlyState';

export default combineReducers({
  offlineForm,
  preChatForm,
  readOnlyState
});
