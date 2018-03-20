import { combineReducers } from 'redux';

import offlineForm from './offline-form';
import preChatForm from './prechat-form';

export default combineReducers({
  offlineForm,
  preChatForm
});
