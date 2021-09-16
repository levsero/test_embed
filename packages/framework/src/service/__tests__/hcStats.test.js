import { i18n } from 'src/apps/webWidget/services/i18n'
import * as selectors from 'src/redux/modules/base/base-selectors'
import { http } from 'src/service/transport'
import * as pages from 'src/util/pages'
import hcStats from '../hcStats'

beforeEach(() => {
  jest.spyOn(http, 'send')
})

describe('articleViewed', () => {
  const params = {
    query: 'test',
    resultsCount: 9,
    uniqueSearchResultClick: true,
    searchId: 1,
  }

  test('sends the expected params', () => {
    hcStats.articleViewed(123, 'fr', params)
    expect(http.send).toHaveBeenCalledWith(
      expect.objectContaining({
        method: 'post',
        path: `/api/v2/help_center/fr/articles/123/stats/view.json`,
        useHostMappingIfAvailable: false,
        params: {
          last_search: {
            query: params.query,
            results_count: params.resultsCount,
            search_id: params.searchId,
            origin: 'web_widget',
          },
          unique_search_result_click: params.uniqueSearchResultClick,
        },
        authorization: '',
      })
    )
  })

  test('sends the bearer token', () => {
    jest.spyOn(selectors, 'getAuthToken').mockReturnValue('abc')
    hcStats.articleViewed(123, 'fr', params)
    expect(http.send).toHaveBeenCalledWith(
      expect.objectContaining({
        authorization: 'Bearer abc',
      })
    )
  })

  test('sets the useHostMappingIfAvailable property', () => {
    jest.spyOn(pages, 'isOnHostMappedDomain').mockReturnValue(true)
    hcStats.articleViewed(123, 'fr', params)
    expect(http.send).toHaveBeenCalledWith(
      expect.objectContaining({
        useHostMappingIfAvailable: true,
      })
    )
  })
})

describe('ticketSubmitted', () => {
  beforeEach(() => {
    jest.spyOn(i18n, 'getLocale').mockReturnValue('fr')
  })

  test('sends the expected params', () => {
    hcStats.ticketSubmitted(123, 'query')
    expect(http.send).toHaveBeenCalledWith(
      expect.objectContaining({
        method: 'post',
        path: '/api/v2/help_center/fr/tickets/123/stats.json',
        useHostMappingIfAvailable: false,
        params: {
          last_search: {
            query: 'query',
            origin: 'web_widget',
          },
        },
        authorization: '',
      })
    )
  })

  test('sends the bearer token', () => {
    jest.spyOn(selectors, 'getAuthToken').mockReturnValue('abc')
    hcStats.ticketSubmitted(123, 'query')
    expect(http.send).toHaveBeenCalledWith(
      expect.objectContaining({
        authorization: 'Bearer abc',
      })
    )
  })

  test('sets the useHostMappingIfAvailable property', () => {
    jest.spyOn(pages, 'isOnHostMappedDomain').mockReturnValue(true)
    hcStats.ticketSubmitted(123, 'query')
    expect(http.send).toHaveBeenCalledWith(
      expect.objectContaining({
        useHostMappingIfAvailable: true,
      })
    )
  })
})
