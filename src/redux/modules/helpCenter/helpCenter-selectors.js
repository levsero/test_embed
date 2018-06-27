import { createSelector } from 'reselect';

const getContextualSearch = (state) => state.helpCenter.contextualSearch;

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
export const getContextualSearchScreen = (state) => getContextualSearch(state).screen;

export const getHasSearched = createSelector(
  [getHasContextuallySearched, getTotalUserSearches],
  (hasContextuallySearched, numOfUserSearches) => {
    return hasContextuallySearched || numOfUserSearches > 0;
  }
);
