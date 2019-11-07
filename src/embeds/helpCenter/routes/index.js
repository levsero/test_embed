const routes = {
  home: () => '/',
  searchPrompt: () => '/search-prompt',
  search: () => '/search',
  articles: id => `/articles/${id || ':id'}`
}

export default routes
