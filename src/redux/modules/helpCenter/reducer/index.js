import { combineReducers } from 'redux';

import searchLoading from './helpCenter-searchLoading';
import articleClicked from './helpCenter-articleClicked';
import searchFailed from './helpCenter-searchFailed';
import searchTerm from './helpCenter-searchTerm';
import hasSearched from './helpCenter-hasSearched';
import hasContextuallySearched from './helpCenter-hasContextuallySearched';

export default combineReducers({
  searchLoading,
  articleClicked,
  searchFailed,
  searchTerm,
  hasSearched,
  hasContextuallySearched
});

