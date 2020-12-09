export default {
  home: () => '/',
  searchPrompt: () => '/search-prompt',
  search: () => '/search',
  articles: id => `/articles/${id || ':id'}`
}
