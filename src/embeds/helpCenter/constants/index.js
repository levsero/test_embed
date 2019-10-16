export const ROUTES = {
  HOME: '/',
  SEARCH_PROMPT: '/search-prompt',
  SEARCH: '/search',
  articles: id => `/articles/${id || ':id'}`
}
