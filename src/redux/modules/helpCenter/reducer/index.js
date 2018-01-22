import { combineReducers } from 'redux';

import activeArticle from './helpCenter-activeArticle';
import searchLoading from './helpCenter-searchLoading';
import articleClicked from './helpCenter-articleClicked';
import viewMoreClicked from './helpCenter-viewMoreClicked';
import searchFailed from './helpCenter-searchFailed';
import searchTerm from './helpCenter-searchTerm';
import hasSearched from './helpCenter-hasSearched';
import hasContextuallySearched from './helpCenter-hasContextuallySearched';
import articles from './helpCenter-articles';
import resultsPerPage from './helpCenter-resultsPerPage';
import resultsCount from './helpCenter-resultsCount';

export default combineReducers({
  activeArticle,
  searchLoading,
  articleClicked,
  viewMoreClicked,
  searchFailed,
  searchTerm,
  hasSearched,
  hasContextuallySearched,
  articles,
  resultsCount,
  resultsPerPage
});
