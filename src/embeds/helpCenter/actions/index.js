import _ from 'lodash'

import { MAXIMUM_SEARCH_RESULTS } from 'src/constants/helpCenter'
import { http } from 'service/transport'
import { location } from 'utility/globals'
import {
  getAuthToken,
  getHasWidgetShown,
  getIsAuthenticationPending
} from 'src/redux/modules/base/base-selectors'
import {
  getLastSearchTimestamp,
  getContextualHelpRequestNeeded,
  getSearchQuery,
  getTokensRevokedAt
} from 'embeds/helpCenter/selectors'
import { getHasPassedAuth } from 'src/redux/modules/selectors/helpCenter-linked-selectors'
import { i18n } from 'service/i18n'
import { MAXIMUM_CONTEXTUAL_SEARCH_RESULTS } from 'src/constants/helpCenter'
import {
  SEARCH_REQUEST_SENT,
  SEARCH_REQUEST_SUCCESS,
  SEARCH_REQUEST_FAILURE,
  CONTEXTUAL_SEARCH_REQUEST_SENT,
  CONTEXTUAL_SEARCH_REQUEST_SUCCESS,
  CONTEXTUAL_SEARCH_REQUEST_FAILURE,
  ARTICLE_VIEWED,
  ORIGINAL_ARTICLE_CLICKED,
  ARTICLE_CLOSED,
  ADD_RESTRICTED_IMAGE,
  GET_ARTICLE_REQUEST_SENT,
  GET_ARTICLE_REQUEST_SUCCESS,
  GET_ARTICLE_REQUEST_FAILURE,
  SEARCH_FIELD_CHANGED,
  CONTEXTUAL_SUGGESTIONS_MANUALLY_SET
} from './action-types'
import { updateQueue, authenticate, expireToken } from 'src/redux/modules/base'
import { isOnHostMappedDomain } from 'utility/pages'
import {
  getSettingsHelpCenterFilter,
  getSettingsHelpCenterLocaleFallbacks
} from 'src/redux/modules/settings/settings-selectors'
import { settings } from 'service/settings'

const sendQuery = async (path, query, doneFn, failFn, filter, responseType) => {
  const token = getAuthToken()
  const forceHttp = isOnHostMappedDomain() && location.protocol === 'http:'
  const queryParams = _.extend(query, filter)
  return http
    .get({
      forceHttp: forceHttp,
      useHostMappingIfAvailable: isOnHostMappedDomain(),
      path,
      query: queryParams,
      authorization: token ? `Bearer ${token}` : '',
      responseType
    })
    .then(res => {
      doneFn(res)
    })
    .catch(err => {
      if (failFn) {
        failFn(err)
      }
    })
}

const formatResults = response => {
  const { results = [], count = 0 } = response.body

  return {
    articles: results,
    resultsCount: count,
    locale: results.length > 0 ? results[0].locale : ''
  }
}

const preventSearchCompleteDispatch = (getState, timestamp) => {
  /* This is implemented in order to prevent slow connections from returning
     successful responses in quick succession which causes screen states to
     flicker on the front-end which causes a weird experience and could potentially
     render an incorrect state. To prevent that we only dispatch the promised callbacks
     if it's the last message recorded via its ID. */
  return timestamp !== getLastSearchTimestamp(getState())
}

export function performImageSearch(path, done) {
  sendQuery(path, null, done, null, null, 'blob')

  // Temporary to stop middleware from breaking until we properly implement images
  return { type: '' }
}

export function performSearch(searchTerm, success = () => {}, fail = () => {}, localeIndex = 0) {
  return async (dispatch, getState) => {
    // When localeFallbacks is defined in the zESettings object then
    // attempt the search with each locale in that array in order. Otherwise
    // try the search with no locale (injects an empty string into localeFallbacks).
    const locales = [i18n.getLocale()].concat([
      getSettingsHelpCenterLocaleFallbacks(getState()) || ['']
    ])

    if (localeIndex >= locales.length) {
      return
    }

    const query = {
      locale: locales[localeIndex],
      query: searchTerm,
      per_page: MAXIMUM_SEARCH_RESULTS,
      origin: 'web_widget'
    }

    const timestamp = Date.now()
    const path = '/api/v2/help_center/articles/embeddable_search.json'

    const successFn = response => {
      if (preventSearchCompleteDispatch(getState, timestamp)) return

      dispatch({
        type: SEARCH_REQUEST_SUCCESS,
        payload: {
          ...formatResults(response),
          isFallback: localeIndex > 0
        }
      })

      if (response.body.count > 0 || _.isEmpty(locales)) {
        success(response)
      } else {
        dispatch(performSearch(searchTerm, success, fail, localeIndex + 1))
      }
    }

    const failFn = error => {
      if (preventSearchCompleteDispatch(getState, timestamp)) return

      dispatch({ type: SEARCH_REQUEST_FAILURE })
      fail(error)
    }

    dispatch({
      type: SEARCH_REQUEST_SENT,
      payload: { searchTerm: query.query, timestamp }
    })

    const filter = getSettingsHelpCenterFilter(getState())

    return sendQuery(path, query, successFn, failFn, filter)
  }
}

export function contextualSearch(onDone) {
  return (dispatch, getState) => {
    const state = getState()

    if (getContextualHelpRequestNeeded(state)) {
      if (getHasPassedAuth(state)) {
        dispatch(performContextualSearch(onDone, onDone))
      } else if (getIsAuthenticationPending(state)) {
        dispatch(updateQueue({ performContextualSearch: {} }))
      }
    }
  }
}

export function performContextualSearch(done = () => {}, fail = () => {}) {
  const timestamp = Date.now()

  return async (dispatch, getState) => {
    const searchQuery = getSearchQuery(getState())

    if (!searchQuery.query && !searchQuery.label_names) {
      return
    } // eslint-disable-line camelcase

    const path = '/api/v2/help_center/articles/embeddable_search.json'
    /* eslint camelcase:0 */
    let query = {
      locale: i18n.getLocale(),
      per_page: MAXIMUM_CONTEXTUAL_SEARCH_RESULTS,
      ...searchQuery
    }

    const doneFn = response => {
      if (preventSearchCompleteDispatch(getState, timestamp)) return

      dispatch({
        type: CONTEXTUAL_SEARCH_REQUEST_SUCCESS,
        payload: formatResults(response)
      })
      done(response)
    }
    const failFn = error => {
      if (preventSearchCompleteDispatch(getState, timestamp)) return

      dispatch({ type: CONTEXTUAL_SEARCH_REQUEST_FAILURE })
      fail(error)
    }

    dispatch({
      type: CONTEXTUAL_SEARCH_REQUEST_SENT,
      payload: {
        searchTerm: searchQuery.query || searchQuery.label_names,
        timestamp
      }
    })

    const filter = getSettingsHelpCenterFilter(getState())

    return sendQuery(path, query, doneFn, failFn, filter)
  }
}

export function handleOriginalArticleClicked() {
  return {
    type: ORIGINAL_ARTICLE_CLICKED
  }
}

export function handleArticleView(article) {
  return {
    type: ARTICLE_VIEWED,
    payload: article
  }
}

export function closeCurrentArticle() {
  return { type: ARTICLE_CLOSED }
}

export function addRestrictedImage(img) {
  return {
    type: ADD_RESTRICTED_IMAGE,
    payload: img
  }
}

export function handleSearchFieldChange(value) {
  return {
    type: SEARCH_FIELD_CHANGED,
    payload: value || ''
  }
}

export function displayArticle(articleId) {
  return dispatch => {
    dispatch({ type: GET_ARTICLE_REQUEST_SENT })
    const forceHttp = isOnHostMappedDomain() && location.protocol === 'http:'

    return http
      .get(
        {
          method: 'get',
          forceHttp: forceHttp,
          path: `/api/v2/help_center/articles/${articleId}.json`,
          useHostMappingIfAvailable: isOnHostMappedDomain()
        },
        false
      )
      .then(res => {
        dispatch({
          type: GET_ARTICLE_REQUEST_SUCCESS,
          payload: res.body.article
        })
      })
      .catch(err => {
        dispatch({
          type: GET_ARTICLE_REQUEST_FAILURE,
          payload: err.response ? err.response : err
        })
      })
  }
}

export function setContextualSuggestionsManually(options) {
  return (dispatch, getState) => {
    dispatch({
      type: CONTEXTUAL_SUGGESTIONS_MANUALLY_SET,
      payload: options
    })

    if (getHasWidgetShown(getState())) {
      dispatch(contextualSearch())
    }
  }
}

export function setUpHelpCenterAuth() {
  return (dispatch, getState) => {
    const tokensRevokedAt = getTokensRevokedAt(getState())

    if (tokensRevokedAt) {
      dispatch(expireToken(tokensRevokedAt))
    }

    const settingJwtFn = settings.getAuthSettingsJwtFn()

    if (settingJwtFn) {
      const callback = retrievedJwt => {
        dispatch(authenticate(retrievedJwt))
      }

      return settingJwtFn(callback)
    }

    const settingJwt = settings.getAuthSettingsJwt()

    if (settingJwt) dispatch(authenticate(settingJwt))
  }
}
