import { createSelector } from 'reselect'

import { getPageKeywords } from 'utility/utils'
import { isOnHelpCenterPage } from 'utility/pages'

import {
  CONTEXTUAL_SEARCH_REQUEST_SENT,
  CONTEXTUAL_SEARCH_REQUEST_SUCCESS,
  CONTEXTUAL_SEARCH_REQUEST_FAILURE,
} from 'embeds/helpCenter/actions/action-types'

const getContextualSearch = (state) => state.helpCenter.contextualSearch
const getContextualSearchScreen = (state) => getContextualSearch(state).screen
const getRawSearchedArticles = (state) => state.helpCenter.searchedArticles

export const getPreviousActiveArticle = (state) => state.helpCenter.clickedArticles.previous
export const getCurrentActiveArticle = (state) => state.helpCenter.clickedArticles.current
export const getSearchLoading = (state) => state.helpCenter.searchLoading
export const getArticleClicked = (state) => state.helpCenter.articleClicked
export const getSearchFailed = (state) => state.helpCenter.searchFailed
export const getSearchAttempted = (state) => state.helpCenter.searchAttempted
export const getSearchTerm = (state) => state.helpCenter.searchTerm.current
export const getPreviousSearchTerm = (state) => state.helpCenter.searchTerm.previous
export const getTotalUserSearches = (state) => state.helpCenter.totalUserSearches
export const getArticleViewActive = (state) => !!getCurrentActiveArticle(state)
export const getArticles = (state) => state.helpCenter.articles
export const getResultsCount = (state) => state.helpCenter.resultsCount
export const getResultsLocale = (state) => state.helpCenter.resultsLocale
export const getArticleDisplayed = (state) => state.helpCenter.articleDisplayed
export const getRestrictedImages = (state) => state.helpCenter.restrictedImages
export const getSearchFieldValue = (state) => state.helpCenter.searchFieldValue
export const getHasContextuallySearched = (state) => getContextualSearch(state).hasSearched
export const getLastSearchTimestamp = (state) => state.helpCenter.lastSearchTimestamp
export const getManualContextualSuggestions = (state) =>
  state.helpCenter.manualContextualSuggestions
export const getHelpCenterContextualEnabled = (state) =>
  state.helpCenter.config.contextualHelpEnabled
export const getHelpCenterSignInRequired = (state) => state.helpCenter.config.signInRequired
export const getAnswerBotEnabled = (state) => state.helpCenter.config.answerBotEnabled
export const getButtonLabelKey = (state) => state.helpCenter.config.buttonLabelKey
export const getFormTitleKey = (state) => state.helpCenter.config.formTitleKey
export const getTokensRevokedAt = (state) => state.helpCenter.config.tokensRevokedAt

export const getIsContextualSearchPending = (state) => {
  return getContextualSearchScreen(state) === CONTEXTUAL_SEARCH_REQUEST_SENT
}

export const getIsContextualSearchSuccessful = (state) => {
  return getContextualSearchScreen(state) === CONTEXTUAL_SEARCH_REQUEST_SUCCESS
}

export const getIsContextualSearchFailure = (state) => {
  return getContextualSearchScreen(state) === CONTEXTUAL_SEARCH_REQUEST_FAILURE
}

export const getIsContextualSearchComplete = (state) => {
  return getIsContextualSearchSuccessful(state) || getIsContextualSearchFailure(state)
}

export const getHasSearched = createSelector(
  [getHasContextuallySearched, getSearchAttempted],
  (hasContextuallySearched, searchAttempted) => hasContextuallySearched || searchAttempted
)

const getContextualHelpRequestedViaConfig = createSelector(
  [getHelpCenterContextualEnabled],
  (contextualHelpEnabled) => {
    return contextualHelpEnabled && !isOnHelpCenterPage() && !!getPageKeywords()
  }
)

const getContextualHelpRequestedViaApi = createSelector(
  [getManualContextualSuggestions],
  (manualContextualSuggestions) => {
    const searchTermExists = !!manualContextualSuggestions.query
    const labelsExist =
      !!manualContextualSuggestions.labels && manualContextualSuggestions.labels.length > 0
    const urlSet = !!manualContextualSuggestions.url && !!getPageKeywords()

    return searchTermExists || labelsExist || urlSet
  }
)

export const getContextualHelpRequestNeeded = createSelector(
  [getContextualHelpRequestedViaConfig, getContextualHelpRequestedViaApi],
  (contextualHelpRequestedViaConfig, contextualHelpRequestedViaApi) => {
    return contextualHelpRequestedViaConfig || contextualHelpRequestedViaApi
  }
)

export const getSearchQuery = createSelector(
  [getManualContextualSuggestions],
  (manualContextualSuggestions) => {
    let searchQuery = {}

    if (manualContextualSuggestions.query) {
      searchQuery.query = manualContextualSuggestions.query
    } else if (
      manualContextualSuggestions.labels &&
      manualContextualSuggestions.labels.length > 0
    ) {
      searchQuery.label_names = manualContextualSuggestions.labels.join(',') // eslint-disable-line camelcase
    } else {
      searchQuery.query = getPageKeywords()
    }

    return searchQuery
  }
)

export const getIsShowHCIntroState = createSelector(
  [getHasSearched, getContextualHelpRequestNeeded, getArticleViewActive],
  (hasSearched, contextualHelpRequestNeeded, articleViewActive) => {
    return !hasSearched && !contextualHelpRequestNeeded && !articleViewActive
  }
)

export const shouldShowContextualResults = createSelector(
  [
    getHasContextuallySearched,
    getIsContextualSearchComplete,
    getContextualHelpRequestNeeded,
    getTotalUserSearches,
  ],
  (
    hasContextualSearched,
    isContextualSearchComplete,
    contextualHelpRequestNeeded,
    totalUserSearches
  ) =>
    (hasContextualSearched && isContextualSearchComplete) ||
    (contextualHelpRequestNeeded && totalUserSearches === 0)
)

export const getSearchedArticles = createSelector(
  [getRawSearchedArticles, getArticles],
  (searchedArticles, articles) => searchedArticles.map((id) => articles[id])
)
