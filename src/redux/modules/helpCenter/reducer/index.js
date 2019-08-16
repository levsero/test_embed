import { combineReducers } from 'redux'

import activeArticle from './helpCenter-activeArticle'
import searchLoading from './helpCenter-searchLoading'
import articleClicked from './helpCenter-articleClicked'
import searchFailed from './helpCenter-searchFailed'
import searchTerm from './helpCenter-searchTerm'
import totalUserSearches from './helpCenter-totalUserSearches'
import articles from './helpCenter-articles'
import resultsCount from './helpCenter-resultsCount'
import resultsLocale from './helpCenter-resultsLocale'
import restrictedImages from './helpCenter-restrictedImages'
import searchFieldValue from './helpCenter-searchFieldValue'
import searchFieldFocused from './helpCenter-searchFieldFocused'
import articleDisplayed from './helpCenter-articleDisplayed'
import contextualSearch from './helpCenter-contextualSearch'
import lastSearchTimestamp from './helpCenter-lastSearchTimestamp'
import manualContextualSuggestions from './helpCenter-manualContextualSuggestions'
import config from './config'

export default combineReducers({
  activeArticle,
  articleClicked,
  articleDisplayed,
  articles,
  config,
  contextualSearch,
  lastSearchTimestamp,
  manualContextualSuggestions,
  restrictedImages,
  resultsCount,
  resultsLocale,
  searchFailed,
  searchFieldFocused,
  searchFieldValue,
  searchLoading,
  searchTerm,
  totalUserSearches
})
