import { i18n } from 'classicSrc/app/webWidget/services/i18n'
import * as selectors from 'classicSrc/redux/modules/base/base-selectors'
import { http } from 'classicSrc/service/transport'
import { isOnHostMappedDomain } from '@zendesk/widget-shared-services'
import hcStats from '../hcStats'

jest.mock('@zendesk/widget-shared-services', () => {
  const originalModule = jest.requireActual('@zendesk/widget-shared-services')

  return {
    __esModule: true,
    ...originalModule,
    isOnHostMappedDomain: jest.fn().mockReturnValue(false),
    send: jest.fn(),
  }
})

beforeEach(() => {
  jest.spyOn(http, 'send')
})

describe('articleViewed', () => {
  const params = {
    query: 'test',
    resultsCount: 9,
    uniqueSearchResultClick: true,
    searchId: 1,
    url: 'url',
    rank: 2,
    contextualSearch: false,
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
            clicked_article_url: 'url',
            clicked_article_rank: 2,
          },
          unique_search_result_click: params.uniqueSearchResultClick,
          contextual_search: false,
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
    isOnHostMappedDomain.mockReturnValue(true)
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
    isOnHostMappedDomain.mockReturnValue(false)
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
    isOnHostMappedDomain.mockReturnValue(true)
    hcStats.ticketSubmitted(123, 'query')
    expect(http.send).toHaveBeenCalledWith(
      expect.objectContaining({
        useHostMappingIfAvailable: true,
      })
    )
  })
})
