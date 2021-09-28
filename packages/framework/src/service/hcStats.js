import { i18n } from 'src/apps/webWidget/services/i18n'
import { getAuthToken } from 'src/redux/modules/base/base-selectors'
import { http } from 'src/service/transport'
import { isOnHostMappedDomain } from 'src/util/pages'

const articleViewed = (articleId, locale, params) => {
  const token = getAuthToken()
  http.send({
    timeout: 2000,
    method: 'post',
    path: `/api/v2/help_center/${locale}/articles/${articleId}/stats/view.json`,
    useHostMappingIfAvailable: isOnHostMappedDomain(),
    params: {
      last_search: {
        query: params.query,
        results_count: params.resultsCount,
        search_id: params.searchId,
        origin: 'web_widget',
        clicked_article_rank: params.rank,
        clicked_article_url: params.url,
      },
      contextual_search: params.contextualSearch,
      unique_search_result_click: params.uniqueSearchResultClick,
    },
    authorization: token ? `Bearer ${token}` : '',
  })
}

const ticketSubmitted = (ticketId, query) => {
  const token = getAuthToken()
  const locale = i18n.getLocale()
  http.send({
    timeout: 2000,
    method: 'post',
    path: `/api/v2/help_center/${locale.toLowerCase()}/tickets/${ticketId}/stats.json`,
    useHostMappingIfAvailable: isOnHostMappedDomain(),
    params: { last_search: { query, origin: 'web_widget' } },
    authorization: token ? `Bearer ${token}` : '',
  })
}

export default {
  articleViewed,
  ticketSubmitted,
}
