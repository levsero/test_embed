import { combineReducers } from 'redux';

import searchLoading from './helpCenter-searchLoading';
import articleClicked from './helpCenter-articleClicked';
import searchFailed from './helpCenter-searchFailed';
import searchTerm from './helpCenter-searchTerm';

export default combineReducers({
  searchLoading,
  articleClicked,
  searchFailed,
  searchTerm
});

