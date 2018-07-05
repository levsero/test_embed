import { createSelector } from 'reselect';

import {
  CONTEXTUAL_SEARCH_REQUEST_SENT,
  CONTEXTUAL_SEARCH_REQUEST_SUCCESS,
  CONTEXTUAL_SEARCH_REQUEST_FAILURE
} from 'src/redux/modules/helpCenter/helpCenter-action-types';

const getContextualSearch = (state) => state.helpCenter.contextualSearch;
const getContextualSearchScreen = (state) => getContextualSearch(state).screen;

export const getActiveArticle = (state) => state.helpCenter.activeArticle;
export const getSearchLoading = (state) => state.helpCenter.searchLoading;
export const getArticleClicked = (state) => state.helpCenter.articleClicked;
export const getSearchFailed = (state) => state.helpCenter.searchFailed;
export const getSearchTerm = (state) => state.helpCenter.searchTerm.current;
export const getPreviousSearchTerm = (state) => state.helpCenter.searchTerm.previous;
export const getTotalUserSearches = (state) => state.helpCenter.totalUserSearches;
export const getArticleViewActive = (state) => !!getActiveArticle(state);
export const getArticles = (state) => state.helpCenter.articles;
export const getResultsCount = (state) => state.helpCenter.resultsCount;
export const getChannelChoiceShown = (state) => state.helpCenter.channelChoiceShown;
export const getArticleDisplayed = (state) => state.helpCenter.articleDisplayed;
export const getRestrictedImages = (state) => state.helpCenter.restrictedImages;
export const getSearchFieldValue = (state) => state.helpCenter.searchFieldValue;
export const getSearchFieldFocused = (state) => !!state.helpCenter.searchFieldFocused;
export const getHasContextuallySearched = (state) => getContextualSearch(state).hasSearched;
export const getLastSearchTimestamp = (state) => state.helpCenter.lastSearchTimestamp;

export const getIsContextualSearchPending = (state) => {
  return getContextualSearchScreen(state) === CONTEXTUAL_SEARCH_REQUEST_SENT;
};

export const getIsContextualSearchSuccessful = (state) => {
  return getContextualSearchScreen(state) === CONTEXTUAL_SEARCH_REQUEST_SUCCESS;
};

export const getIsContextualSearchFailure = (state) => {
  return getContextualSearchScreen(state) === CONTEXTUAL_SEARCH_REQUEST_FAILURE;
};

export const getIsContextualSearchComplete = (state) => {
  return getIsContextualSearchSuccessful(state) || getIsContextualSearchFailure(state);
};

export const getHasSearched = createSelector(
  [getHasContextuallySearched, getTotalUserSearches],
  (hasContextuallySearched, numOfUserSearches) => {
    return hasContextuallySearched || numOfUserSearches > 0;
  }
);
