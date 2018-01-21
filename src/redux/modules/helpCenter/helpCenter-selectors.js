export const getActiveArticle = (state) => state.helpCenter.activeArticle;
export const getSearchLoading = (state) => state.helpCenter.searchLoading;
export const getArticleClicked = (state) => state.helpCenter.articleClicked;
export const getViewMoreClicked = (state) => state.helpCenter.viewMoreClicked;
export const getSearchFailed = (state) => state.helpCenter.searchFailed;
export const getSearchTerm = (state) => state.helpCenter.searchTerm.current;
export const getPreviousSearchTerm = (state) => state.helpCenter.searchTerm.previous;
export const getHasSearched = (state) => state.helpCenter.hasSearched;
export const getHasContextuallySearched = (state) => state.helpCenter.hasContextuallySearched;
export const getArticleViewActive = (state) => !!getActiveArticle(state);
export const getArticles = (state) => state.helpCenter.articles;
export const getResultsPerPage = (state) => state.helpCenter.resultsPerPage;
export const getResultsCount = (state) => state.helpCenter.resultsCount;
export const getShowViewMore = (state) => {
  return !getViewMoreClicked(state) &&
         !getHasContextuallySearched(state) &&
         (getResultsCount(state) > getArticles(state).length);
};
