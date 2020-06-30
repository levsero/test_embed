import configureMockStore from 'redux-mock-store'
import thunk from 'redux-thunk'
import * as actions from '../index'
import * as types from 'embeds/helpCenter/actions/action-types'
import * as baseActionTypes from 'src/redux/modules/base/base-action-types'
import * as baseSelectors from 'src/redux/modules/base/base-selectors'
import * as helpCenterSelectors from 'embeds/helpCenter/selectors'
import * as helpCenterLinkedSelectors from 'src/redux/modules/selectors/helpCenter-linked-selectors'
import * as settingsSelectors from 'src/redux/modules/settings/settings-selectors'
import * as pages from 'utility/pages'
import { settings } from 'service/settings'
import { http } from 'service/transport'
import { i18n } from 'service/i18n'
import { wait } from '@testing-library/react'
jest.mock('service/transport')
jest.mock('src/redux/modules/base/base-selectors')
jest.mock('utility/pages')
jest.mock('service/settings')
helpCenterSelectors.getLastSearchTimestamp = jest.fn()

beforeEach(() => {
  http.get = jest.fn(() => {
    return new Promise(resolve => {
      resolve()
    })
  })
})

const mockStore = configureMockStore([thunk])

test('handleOriginalArticleClicked dispatches expected action', () => {
  const expected = {
    type: types.ORIGINAL_ARTICLE_CLICKED
  }

  expect(actions.handleOriginalArticleClicked()).toEqual(expected)
})

test('handleArticleClick dispatches expected action', () => {
  const expected = {
    type: types.ARTICLE_VIEWED,
    payload: { x: 123 }
  }

  expect(actions.handleArticleView({ x: 123 })).toEqual(expected)
})

test('closeCurrentArticle dispatches expected action', () => {
  const expected = {
    type: types.ARTICLE_CLOSED
  }

  expect(actions.closeCurrentArticle()).toEqual(expected)
})

test('addRestrictedImage dispatches expected action', () => {
  const expected = {
    type: types.ADD_RESTRICTED_IMAGE,
    payload: { x: 123 }
  }

  expect(actions.addRestrictedImage({ x: 123 })).toEqual(expected)
})

test('handleSearchFieldChange dispatches expected action', () => {
  const expected = {
    type: types.SEARCH_FIELD_CHANGED,
    payload: { y: 1234 }
  }

  expect(actions.handleSearchFieldChange({ y: 1234 })).toEqual(expected)
})

describe('performImageSearch', () => {
  const doneFn = jest.fn()

  it('returns expected action', () => {
    expect(actions.performImageSearch('/this/is/path', doneFn)).toEqual({
      type: ''
    })
  })

  describe('http', () => {
    it('sends expected http payload', () => {
      actions.performImageSearch('/this/is/path', doneFn)
      expect(http.getImage).toHaveBeenCalledWith(
        expect.objectContaining({
          path: '/this/is/path',
          authorization: ''
        })
      )
    })

    it('includes auth token if available', () => {
      baseSelectors.getAuthToken.mockReturnValue('blah')
      actions.performImageSearch('/this/is/path', doneFn)
      expect(http.getImage).toHaveBeenCalledWith(
        expect.objectContaining({
          authorization: 'Bearer blah'
        })
      )
    })
  })
})

describe('displayArticle', () => {
  const dispatchAction = articleId => {
    const store = mockStore()

    store.dispatch(actions.displayArticle(articleId))
    return store
  }

  it('dispatches expected action', () => {
    const store = dispatchAction()

    expect(store.getActions()).toEqual([
      {
        type: types.GET_ARTICLE_REQUEST_SENT
      }
    ])
  })

  it('sends the expected request payload', () => {
    dispatchAction(123)

    expect(http.get).toHaveBeenCalledWith(
      expect.objectContaining({
        method: 'get',
        path: '/api/v2/help_center/articles/123.json'
      }),
      false
    )
  })

  it('sends the expected request payload when not on host mapped domain', () => {
    pages.isOnHostMappedDomain.mockReturnValue(false)
    dispatchAction(123)

    expect(http.get).toHaveBeenCalledWith(
      expect.objectContaining({
        forceHttp: false,
        useHostMappingIfAvailable: false
      }),
      false
    )
  })

  it('sends the expected request payload when on host mapped domain', () => {
    pages.isOnHostMappedDomain.mockReturnValue(true)
    dispatchAction(123)

    expect(http.get).toHaveBeenCalledWith(
      expect.objectContaining({
        forceHttp: true,
        useHostMappingIfAvailable: true
      }),
      false
    )
  })

  const asyncDispatchAction = async articleId => {
    const store = mockStore()

    await store.dispatch(actions.displayArticle(articleId))
    return store
  }

  it('dispatches expected action on failed request', async () => {
    http.get = jest.fn(() => {
      return new Promise((resolve, reject) => {
        reject({ response: 'something bad happened' })
      })
    })

    const store = await asyncDispatchAction(123)

    expect(store.getActions()[1]).toEqual({
      type: types.GET_ARTICLE_REQUEST_FAILURE,
      payload: 'something bad happened'
    })
  })

  it('dispatches expected action on successful request', async () => {
    http.get = jest.fn(() => {
      return new Promise(resolve => {
        resolve({ body: { article: 'blah' } })
      })
    })
    const store = await asyncDispatchAction(123)

    expect(store.getActions()[1]).toEqual({
      type: types.GET_ARTICLE_REQUEST_SUCCESS,
      payload: 'blah'
    })
  })
})

describe('setContextualSuggestionsManually', () => {
  it('dispatches CONTEXTUAL_SUGGESTIONS_MANUALLY_SET only when widget is not shown', () => {
    const store = mockStore()
    const options = { x: 1 }

    store.dispatch(actions.setContextualSuggestionsManually(options))
    expect(store.getActions()).toEqual([
      {
        payload: options,
        type: types.CONTEXTUAL_SUGGESTIONS_MANUALLY_SET
      }
    ])
  })

  describe('when widget has shown', () => {
    let store
    const options = { x: 1 }
    const callback = jest.fn()

    beforeEach(() => {
      jest.spyOn(baseSelectors, 'getHasWidgetShown').mockReturnValue(true)
      jest.spyOn(helpCenterSelectors, 'getContextualHelpRequestNeeded').mockReturnValue(true)
      jest.spyOn(helpCenterLinkedSelectors, 'getHasPassedAuth').mockReturnValue(true)
      jest.spyOn(helpCenterSelectors, 'getSearchQuery').mockReturnValue({
        query: 'help'
      })
      jest.spyOn(settingsSelectors, 'getSettingsHelpCenterFilter').mockReturnValue(null)
      jest.spyOn(helpCenterSelectors, 'getLastSearchTimestamp').mockReturnValue(1)
      jest.spyOn(Date, 'now').mockReturnValue(1)
      store = mockStore()
    })

    it('dispatches expected actions when widget has shown', () => {
      store.dispatch(actions.setContextualSuggestionsManually(options, callback))
      const dispatchedActions = store.getActions()

      expect(dispatchedActions[0]).toEqual({
        payload: options,
        type: types.CONTEXTUAL_SUGGESTIONS_MANUALLY_SET
      })
      expect(dispatchedActions[1]).toEqual(
        expect.objectContaining({
          type: types.CONTEXTUAL_SEARCH_REQUEST_SENT
        })
      )
    })

    it('sends http request with expected payload', () => {
      store.dispatch(actions.setContextualSuggestionsManually(options, callback))
      expect(http.get).toHaveBeenCalledWith(
        expect.objectContaining({
          path: '/api/v2/help_center/articles/embeddable_search.json'
        })
      )
    })
  })
})

describe('performSearch', () => {
  const doneFn = jest.fn(),
    failFn = jest.fn(),
    helpCenterFilter = { x: 123 },
    query = 'help'

  beforeEach(() => {
    jest.spyOn(Date, 'now').mockReturnValue(1234)
    jest.spyOn(settingsSelectors, 'getSettingsHelpCenterFilter').mockReturnValue(helpCenterFilter)
    jest
      .spyOn(settingsSelectors, 'getSettingsHelpCenterLocaleFallbacks')
      .mockReturnValue(['fr', 'ar'])
  })

  it('dispatches SEARCH_REQUEST_SENT', () => {
    const store = mockStore()

    store.dispatch(actions.performSearch(query))
    expect(store.getActions()).toEqual([
      {
        payload: {
          searchTerm: 'help',
          timestamp: 1234
        },
        type: types.SEARCH_REQUEST_SENT
      }
    ])
  })

  it('sends the expected http payload', () => {
    const store = mockStore()

    store.dispatch(actions.performSearch(query, doneFn, failFn))

    expect(http.get).toHaveBeenCalledWith(
      expect.objectContaining({
        path: '/api/v2/help_center/articles/embeddable_search.json',
        query: {
          query: 'help',
          x: 123,
          locale: '',
          origin: 'web_widget',
          per_page: 9
        }
      })
    )
  })

  describe('on success', () => {
    it('dispatches SEARCH_REQUEST_SUCCESS if timestamp matches', async () => {
      const response = {
        body: {
          results: [
            {
              locale: 'fr',
              text: 'blah'
            }
          ],
          count: 1
        }
      }
      http.get = jest.fn(() => {
        return new Promise(resolve => {
          resolve(response)
        })
      })

      jest.spyOn(helpCenterSelectors, 'getLastSearchTimestamp').mockReturnValue(1234)
      const store = mockStore()

      await store.dispatch(actions.performSearch(query, doneFn, failFn))
      expect(store.getActions()[1]).toEqual({
        payload: {
          articles: [{ locale: 'fr', text: 'blah' }],
          locale: 'fr',
          resultsCount: 1,
          isFallback: false
        },
        type: types.SEARCH_REQUEST_SUCCESS
      })

      expect(doneFn).toHaveBeenCalled()
    })

    it('prevents dispatch of SEARCH_REQUEST_SUCCESS if timestamp does not matches', async () => {
      jest.spyOn(helpCenterSelectors, 'getLastSearchTimestamp').mockReturnValue(4321)
      const response = {
        body: {
          results: [
            {
              locale: 'fr',
              text: 'blah'
            }
          ],
          count: 1
        }
      }
      http.get = jest.fn(() => {
        return new Promise(resolve => {
          resolve(response)
        })
      })

      const store = mockStore()

      await store.dispatch(actions.performSearch(query, doneFn, failFn))
      expect(store.getActions().length).toEqual(1)
      expect(doneFn).not.toHaveBeenCalled()
    })

    it('tries again if no results', async () => {
      const response = {
        body: {
          results: [],
          count: 0
        }
      }
      http.get = jest.fn(() => {
        return new Promise(resolve => {
          resolve(response)
        })
      })

      jest.spyOn(helpCenterSelectors, 'getLastSearchTimestamp').mockReturnValue(1234)
      const store = mockStore()

      await store.dispatch(actions.performSearch(query, doneFn, failFn))
      expect(store.getActions()).toMatchInlineSnapshot(`
        Array [
          Object {
            "payload": Object {
              "searchTerm": "help",
              "timestamp": 1234,
            },
            "type": "widget/helpCenter/SEARCH_REQUEST_SENT",
          },
          Object {
            "payload": Object {
              "articles": Array [],
              "isFallback": false,
              "locale": "",
              "resultsCount": 0,
            },
            "type": "widget/helpCenter/SEARCH_REQUEST_SUCCESS",
          },
          Object {
            "payload": Object {
              "searchTerm": "help",
              "timestamp": 1234,
            },
            "type": "widget/helpCenter/SEARCH_REQUEST_SENT",
          },
          Object {
            "payload": Object {
              "articles": Array [],
              "isFallback": true,
              "locale": "",
              "resultsCount": 0,
            },
            "type": "widget/helpCenter/SEARCH_REQUEST_SUCCESS",
          },
        ]
      `)
    })
  })

  describe('on failure', () => {
    it('dispatches SEARCH_REQUEST_FAILURE if timestamp matches', async () => {
      http.get = jest.fn(() => {
        return new Promise((resolve, reject) => {
          reject()
        })
      })

      jest.spyOn(helpCenterSelectors, 'getLastSearchTimestamp').mockReturnValue(1234)
      const store = mockStore()

      await store.dispatch(actions.performSearch(query, doneFn, failFn))
      expect(store.getActions()[1]).toEqual({ type: 'widget/helpCenter/SEARCH_REQUEST_FAILURE' })

      expect(failFn).toHaveBeenCalled()
    })

    it('prevents dispatch of SEARCH_REQUEST_FAILURE if timestamp does not matches', async () => {
      jest.spyOn(helpCenterSelectors, 'getLastSearchTimestamp').mockReturnValue(4321)

      http.get = jest.fn(() => {
        return new Promise((resolve, reject) => {
          reject()
        })
      })

      const store = mockStore()

      await store.dispatch(actions.performSearch(query, doneFn, failFn))
      expect(store.getActions().length).toEqual(1)
      expect(failFn).not.toHaveBeenCalled()
    })
  })
})

describe('performContextualSearch', () => {
  const doneFn = jest.fn(),
    failFn = jest.fn(),
    helpCenterFilter = { x: 123 },
    query = { query: 'help' }

  beforeEach(() => {
    jest.spyOn(Date, 'now').mockReturnValue(1234)
    jest.spyOn(settingsSelectors, 'getSettingsHelpCenterFilter').mockReturnValue(helpCenterFilter)
    jest.spyOn(helpCenterSelectors, 'getSearchQuery').mockReturnValue(query)
  })

  it('dispatches CONTEXTUAL_SEARCH_REQUEST_SENT', () => {
    const store = mockStore()

    store.dispatch(actions.performContextualSearch(query))
    expect(store.getActions()).toEqual([
      {
        payload: {
          searchTerm: 'help',
          timestamp: 1234
        },
        type: types.CONTEXTUAL_SEARCH_REQUEST_SENT
      }
    ])
  })

  it('sends the expected http payload', async () => {
    const store = mockStore()

    jest.spyOn(i18n, 'getLocale').mockReturnValue('fil')
    store.dispatch(actions.performContextualSearch(doneFn, failFn))
    expect(http.get).toHaveBeenCalledWith(
      expect.objectContaining({
        path: '/api/v2/help_center/articles/embeddable_search.json',
        query: {
          query: 'help',
          x: 123,
          per_page: 3, // eslint-disable-line camelcase
          locale: 'fil'
        }
      })
    )
  })

  describe('on success', () => {
    it('dispatches CONTEXTUAL_SEARCH_REQUEST_SUCCESS if timestamp matches', async () => {
      const response = {
        body: {
          results: [
            {
              locale: 'fr',
              text: 'blah'
            }
          ],
          count: 1
        }
      }
      http.get = jest.fn(() => {
        return new Promise(resolve => {
          resolve(response)
        })
      })

      jest.spyOn(helpCenterSelectors, 'getLastSearchTimestamp').mockReturnValue(1234)
      const store = mockStore()

      await store.dispatch(actions.performContextualSearch(doneFn, failFn))
      expect(store.getActions().length).toEqual(2)
      expect(store.getActions()[1]).toEqual({
        payload: {
          articles: [{ locale: 'fr', text: 'blah' }],
          locale: 'fr',
          resultsCount: 1
        },
        type: types.CONTEXTUAL_SEARCH_REQUEST_SUCCESS
      })

      expect(doneFn).toHaveBeenCalled()
    })

    it('prevents dispatch of CONTEXTUAL_SEARCH_REQUEST_SUCCESS if timestamp does not matches', async () => {
      jest.spyOn(helpCenterSelectors, 'getLastSearchTimestamp').mockReturnValue(4321)
      const response = {
        body: {
          results: [
            {
              locale: 'fr',
              text: 'blah'
            }
          ],
          count: 1
        }
      }
      http.get = jest.fn(() => {
        return new Promise(resolve => {
          resolve(response)
        })
      })

      const store = mockStore()

      await store.dispatch(actions.performContextualSearch(doneFn, failFn))
      expect(store.getActions().length).toEqual(1)
      expect(doneFn).not.toHaveBeenCalled()
    })
  })

  describe('on failure', () => {
    it('dispatches CONTEXTUAL_SEARCH_REQUEST_FAILURE if timestamp matches', async () => {
      http.get = jest.fn(() => {
        return new Promise((resolve, reject) => {
          reject()
        })
      })

      jest.spyOn(helpCenterSelectors, 'getLastSearchTimestamp').mockReturnValue(1234)
      const store = mockStore()

      wait(await store.dispatch(actions.performContextualSearch(doneFn, failFn)))
      expect(store.getActions()[1]).toEqual({
        type: 'widget/helpCenter/CONTEXTUAL_SEARCH_REQUEST_FAILURE'
      })

      expect(failFn).toHaveBeenCalled()
    })

    it('prevents dispatch of CONTEXTUAL_SEARCH_REQUEST_FAILURE if timestamp does not matches', async () => {
      jest.spyOn(helpCenterSelectors, 'getLastSearchTimestamp').mockReturnValue(4321)

      http.get = jest.fn(() => {
        return new Promise((resolve, reject) => {
          reject()
        })
      })

      const store = mockStore()

      await store.dispatch(actions.performContextualSearch(query, doneFn, failFn))
      expect(store.getActions().length).toEqual(1)
      expect(failFn).not.toHaveBeenCalled()
    })
  })
})

describe('contextualSearch', () => {
  const callback = jest.fn()
  const helpCenterFilter = { x: 123 }
  const dispatchAction = () => {
    const store = mockStore()

    store.dispatch(actions.contextualSearch(callback))
    return store
  }

  it('dispatches nothing if contextual help is not needed', () => {
    jest.spyOn(helpCenterSelectors, 'getContextualHelpRequestNeeded').mockReturnValue(false)
    const store = dispatchAction()

    expect(callback).not.toHaveBeenCalled()
    expect(store.getActions()).toEqual([])
  })

  describe('contextual help needed', () => {
    beforeEach(() => {
      jest.spyOn(helpCenterSelectors, 'getContextualHelpRequestNeeded').mockReturnValue(true)
      jest.spyOn(settingsSelectors, 'getSettingsHelpCenterFilter').mockReturnValue(helpCenterFilter)
    })

    describe('has passed auth', () => {
      it('performs contextual search if auth passed', () => {
        jest.spyOn(helpCenterLinkedSelectors, 'getHasPassedAuth').mockReturnValue(true)
        jest.spyOn(helpCenterSelectors, 'getSearchQuery').mockReturnValue({
          query: 'help'
        })
        const store = dispatchAction()

        expect(store.getActions()).toEqual([
          expect.objectContaining({
            type: types.CONTEXTUAL_SEARCH_REQUEST_SENT
          })
        ])
      })
    })

    describe('auth is pending', () => {
      it('updates the queue', () => {
        jest.spyOn(helpCenterLinkedSelectors, 'getHasPassedAuth').mockReturnValue(false)
        jest.spyOn(baseSelectors, 'getIsAuthenticationPending').mockReturnValue(true)
        const store = dispatchAction()

        expect(store.getActions()).toEqual([
          {
            payload: {
              performContextualSearch: {}
            },
            type: baseActionTypes.UPDATE_QUEUE
          }
        ])
      })
    })
  })
})

describe('setUpHelpCenterAuth', () => {
  const dispatchAction = () => {
    const store = mockStore()

    store.dispatch(actions.setUpHelpCenterAuth())
    return store
  }

  it('dispatches an expireToken event if tokens have been revoked', () => {
    jest
      .spyOn(helpCenterSelectors, 'getTokensRevokedAt')
      .mockReturnValue(Math.floor(Date.now() / 1000))

    const store = dispatchAction()

    expect(store.getActions()[0]).toEqual({
      type: baseActionTypes.AUTHENTICATION_TOKEN_NOT_REVOKED
    })
  })

  it('does not dispatch an expire token event if tokens have not been revoked', () => {
    jest.spyOn(helpCenterSelectors, 'getTokensRevokedAt').mockReturnValue(null)
    const store = dispatchAction()

    expect(store.getActions()[0]).toBeFalsy()
  })

  it('dispatches an authentication event if a jwtFn exists in settings', () => {
    jest.spyOn(settings, 'getAuthSettingsJwt').mockReturnValue(null)
    jest.spyOn(settings, 'getAuthSettingsJwtFn').mockReturnValue(cb => cb('123'))
    jest.spyOn(helpCenterSelectors, 'getTokensRevokedAt').mockReturnValue(null)
    const store = dispatchAction()

    expect(store.getActions()[0]).toEqual({ type: baseActionTypes.AUTHENTICATION_PENDING })
  })

  it('dispatches an authentication event if a jwt exists in settings', () => {
    jest.spyOn(settings, 'getAuthSettingsJwt').mockReturnValue('123')
    jest.spyOn(settings, 'getAuthSettingsJwtFn').mockReturnValue(null)
    jest.spyOn(helpCenterSelectors, 'getTokensRevokedAt').mockReturnValue(null)
    const store = dispatchAction()

    expect(store.getActions()[0]).toEqual({ type: baseActionTypes.AUTHENTICATION_PENDING })
  })
})
