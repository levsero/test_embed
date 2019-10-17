import { combineReducers } from 'redux'

import activeArticle from './activeArticle'
import searchLoading from './searchLoading'
import articleClicked from './articleClicked'
import searchFailed from './searchFailed'
import searchTerm from './searchTerm'
import totalUserSearches from './totalUserSearches'
import articles from './articles'
import resultsCount from './resultsCount'
import resultsLocale from './resultsLocale'
import restrictedImages from './restrictedImages'
import searchFieldValue from './searchFieldValue'
import articleDisplayed from './articleDisplayed'
import contextualSearch from './contextualSearch'
import lastSearchTimestamp from './lastSearchTimestamp'
import manualContextualSuggestions from './manualContextualSuggestions'
import searchAttempted from './searchAttempted'
import config from './config'
import clickedArticles from './clickedArticles'

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
  searchAttempted,
  searchFailed,
  searchFieldValue,
  searchLoading,
  searchTerm,
  totalUserSearches,
  clickedArticles
})
