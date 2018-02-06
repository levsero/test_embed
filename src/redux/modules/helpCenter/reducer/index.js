import { combineReducers } from 'redux';

import activeArticle from './helpCenter-activeArticle';
import searchLoading from './helpCenter-searchLoading';
import articleClicked from './helpCenter-articleClicked';
import searchFailed from './helpCenter-searchFailed';
import searchTerm from './helpCenter-searchTerm';
import totalUserSearches from './helpCenter-totalUserSearches';
import hasContextuallySearched from './helpCenter-hasContextuallySearched';
import articles from './helpCenter-articles';
import resultsPerPage from './helpCenter-resultsPerPage';
import resultsCount from './helpCenter-resultsCount';
import restrictedImages from './helpCenter-restrictedImages';
import channelChoiceShown from './helpCenter-channelChoiceShown';
import searchFieldValue from './helpCenter-searchFieldValue';

export default combineReducers({
  activeArticle,
  searchLoading,
  articleClicked,
  searchFailed,
  searchTerm,
  articles,
  resultsCount,
  resultsPerPage,
  totalUserSearches,
  hasContextuallySearched,
  restrictedImages,
  channelChoiceShown,
  searchFieldValue
});
