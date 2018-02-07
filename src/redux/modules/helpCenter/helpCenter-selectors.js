export const getActiveArticle = (state) => state.helpCenter.activeArticle;
export const getSearchLoading = (state) => state.helpCenter.searchLoading;
export const getArticleClicked = (state) => state.helpCenter.articleClicked;
export const getViewMoreClicked = (state) => state.helpCenter.viewMoreClicked;
export const getSearchFailed = (state) => state.helpCenter.searchFailed;
export const getSearchTerm = (state) => state.helpCenter.searchTerm.current;
export const getPreviousSearchTerm = (state) => state.helpCenter.searchTerm.previous;
export const getTotalUserSearches = (state) => state.helpCenter.totalUserSearches;
export const getArticleViewActive = (state) => !!getActiveArticle(state);
export const getArticles = (state) => state.helpCenter.articles;
export const getResultsPerPage = (state) => state.helpCenter.resultsPerPage;
export const getResultsCount = (state) => state.helpCenter.resultsCount;
export const getChannelChoiceShown = (state) => state.helpCenter.channelChoiceShown;
export const getHasContextuallySearched = (state) => {
  return state.helpCenter.hasContextuallySearched && getArticles(state).length > 0;
};
export const getHasSearched = (state) => getHasContextuallySearched(state) || getTotalUserSearches(state) > 0;
export const getRestrictedImages = (state) => state.helpCenter.restrictedImages;
export const getSearchFieldValue = (state) => state.helpCenter.searchFieldValue;
export const getShowViewMore = (state) => {
  return !getViewMoreClicked(state) &&
         !getHasContextuallySearched(state) &&
         (getResultsCount(state) > getArticles(state).length);
};
