import _ from 'lodash';

import { http } from 'service/transport';
import { settings } from 'service/settings';
import { location } from 'utility/globals';
import { isOnHostMappedDomain } from 'utility/pages';
import { getAuthToken } from 'src/redux/modules/base/base-selectors';
import { i18n } from 'service/i18n';
import { MAXIMUM_CONTEXTUAL_SEARCH_RESULTS } from 'src/constants/helpCenter';

import { SEARCH_REQUEST_SENT,
  SEARCH_REQUEST_SUCCESS,
  SEARCH_REQUEST_FAILURE,
  CONTEXTUAL_SEARCH_REQUEST_SENT,
  CONTEXTUAL_SEARCH_REQUEST_SUCCESS,
  CONTEXTUAL_SEARCH_REQUEST_FAILURE,
  ARTICLE_CLICKED,
  ORIGINAL_ARTICLE_CLICKED,
  ARTICLE_CLOSED,
  ADD_RESTRICTED_IMAGE,
  CHANNEL_CHOICE_SCREEN_CHANGE_INTENT_SHOWN,
  GET_ARTICLE_REQUEST_SENT,
  GET_ARTICLE_REQUEST_SUCCESS,
  GET_ARTICLE_REQUEST_FAILURE,
  SEARCH_FIELD_CHANGED,
  SEARCH_FIELD_FOCUSED } from './helpCenter-action-types';

const constructHelpCenterPayload = (path, query, doneFn, failFn) => {
  const token = getAuthToken();
  const forceHttp = isOnHostMappedDomain() && location.protocol === 'http:';
  const queryParams = _.extend(query, settings.get('helpCenter.filter'));

  return {
    method: 'get',
    forceHttp: forceHttp,
    useHostMappingIfAvailable: isOnHostMappedDomain(),
    path,
    query: queryParams,
    authorization: token ? `Bearer ${token}` : '',
    callbacks: {
      done: doneFn,
      fail: failFn
    }
  };
};

const formatResults = (response) => {
  const { results = [], count = 0 } = response.body;

  return {
    articles: results,
    resultsCount: count
  };
};

export function performImageSearch(path, done) {
  http.getImage(constructHelpCenterPayload(path, null, done));

  // Temporary to stop middleware from breaking until we properly implement images
  return ({ type: '' });
}

export function performSearch(query, done = () => {}, fail = () => {}) {
  const path = '/api/v2/help_center/search.json';

  return (dispatch) => {
    const doneFn = (response) => {
      dispatch({
        type: SEARCH_REQUEST_SUCCESS,
        payload: formatResults(response)
      });

      done(response);
    };
    const failFn = (error) => {
      dispatch({ type: SEARCH_REQUEST_FAILURE });
      fail(error);
    };

    dispatch({
      type: SEARCH_REQUEST_SENT,
      payload: query.query
    });

    http.send(constructHelpCenterPayload(path, query, doneFn, failFn));
  };
}

export function performContextualSearch(options, done = () => {}, fail = () => {}) {
  return (dispatch) => {
    const path = '/api/v2/help_center/articles/embeddable_search.json';

    /* eslint camelcase:0 */
    let query = {
      locale: i18n.getLocale(),
      per_page: MAXIMUM_CONTEXTUAL_SEARCH_RESULTS
    };
    let searchTerm;

    // This `isString` check is needed in the case that a user passes in only a
    // string to `zE.setHelpCenterSuggestions`. It avoids options.search evaluating
    // to true in that case because it equals the string function `String.prototype.search`.
    if (_.isString(options.search) && options.search.length > 0) {
      searchTerm = query.query = options.search;
    } else if (_.isArray(options.labels) && options.labels.length > 0) {
      searchTerm = query.label_names = options.labels.join(',');
    } else if (options.url && options.pageKeywords && options.pageKeywords.length > 0) {
      searchTerm = query.query = options.pageKeywords;
    } else {
      return;
    }

    const doneFn = (response) => {
      dispatch({ type: CONTEXTUAL_SEARCH_REQUEST_SUCCESS, payload: formatResults(response) });
      done(response);
    };
    const failFn = (error) => {
      dispatch({ type: CONTEXTUAL_SEARCH_REQUEST_FAILURE });
      fail(error);
    };

    dispatch({ type: CONTEXTUAL_SEARCH_REQUEST_SENT, payload: searchTerm });
    http.send(constructHelpCenterPayload(path, query, doneFn, failFn));
  };
}

export function handleOriginalArticleClicked() {
  return {
    type: ORIGINAL_ARTICLE_CLICKED
  };
}

export function handleArticleClick(article) {
  return {
    type: ARTICLE_CLICKED,
    payload: article
  };
}

export function resetActiveArticle() {
  return { type: ARTICLE_CLOSED };
}

export function addRestrictedImage(img) {
  return {
    type: ADD_RESTRICTED_IMAGE,
    payload: img
  };
}

export function updateChannelChoiceShown(bool) {
  return {
    type: CHANNEL_CHOICE_SCREEN_CHANGE_INTENT_SHOWN,
    payload: bool
  };
}

export function handleSearchFieldChange(value) {
  return {
    type: SEARCH_FIELD_CHANGED,
    payload: value
  };
}

export function handleSearchFieldFocus(value) {
  return {
    type: SEARCH_FIELD_FOCUSED,
    payload: value
  };
}

export function displayArticle(articleId) {
  return (dispatch) => {
    dispatch({ type: GET_ARTICLE_REQUEST_SENT });
    const forceHttp = isOnHostMappedDomain() && location.protocol === 'http:';

    http.get({
      method: 'get',
      forceHttp: forceHttp,
      path: `/api/v2/help_center/articles/${articleId}.json`,
      useHostMappingIfAvailable: isOnHostMappedDomain(),
      callbacks: {
        done: (res) => dispatch({
          type: GET_ARTICLE_REQUEST_SUCCESS,
          payload: res.body.article
        }),
        fail: (err) => dispatch({
          type: GET_ARTICLE_REQUEST_FAILURE,
          payload: err.response ? err.response : err
        })
      }
    }, false);
  };
}
