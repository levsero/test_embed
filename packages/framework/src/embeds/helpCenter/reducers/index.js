import { combineReducers } from 'redux'
import articleDisplayed from './articleDisplayed'
import articles from './articles'
import clickedArticles from './clickedArticles'
import config from './config'
import contextualSearch from './contextualSearch'
import lastSearchTimestamp from './lastSearchTimestamp'
import manualContextualSuggestions from './manualContextualSuggestions'
import restrictedImages from './restrictedImages'
import resultsCount from './resultsCount'
import resultsLocale from './resultsLocale'
import searchAttempted from './searchAttempted'
import searchFailed from './searchFailed'
import searchFieldValue from './searchFieldValue'
import searchId from './searchId'
import searchLoading from './searchLoading'
import searchTerm from './searchTerm'
import searchedArticles from './searchedArticles'
import totalUserSearches from './totalUserSearches'

export default combineReducers({
  articleDisplayed,
  articles,
  searchedArticles,
  config,
  contextualSearch,
  lastSearchTimestamp,
  manualContextualSuggestions,
  restrictedImages,
  resultsCount,
  searchId,
  resultsLocale,
  searchAttempted,
  searchFailed,
  searchFieldValue,
  searchLoading,
  searchTerm,
  totalUserSearches,
  clickedArticles,
})
