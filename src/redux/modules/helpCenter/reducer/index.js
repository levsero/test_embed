import { combineReducers } from 'redux';

import searchLoading from './helpCenter-searchLoading';
import articleClicked from './helpCenter-articleClicked';

export default combineReducers({
  searchLoading,
  articleClicked
});

