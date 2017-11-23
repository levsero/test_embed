import { combineReducers } from 'redux';

import searchLoading from './helpCenter-searchLoading';
import articleClicked from './helpCenter-articleClicked';
import searchFailed from './helpCenter-searchFailed';

export default combineReducers({
  searchLoading,
  articleClicked,
  searchFailed
});

