import { combineReducers } from 'redux';

import avatar from './avatar';
import title from './title';
import search from './search';
import suppress from './suppress';

export default combineReducers({
  avatar,
  title,
  search,
  suppress
});
