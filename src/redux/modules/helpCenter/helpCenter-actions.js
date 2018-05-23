import _ from 'lodash';

import { authentication } from 'service/authentication';
import { http } from 'service/transport';
import { settings } from 'service/settings';
import { location } from 'utility/globals';
import { isOnHostMappedDomain } from 'utility/pages';

import { SEARCH_REQUEST_SENT,
  SEARCH_REQUEST_SUCCESS,
  SEARCH_REQUEST_FAILURE,
  CONTEXTUAL_SEARCH_REQUEST_SENT,
  CONTEXTUAL_SEARCH_REQUEST_SUCCESS,
  CONTEXTUAL_SEARCH_REQUEST_FAILURE,
  ARTICLE_CLICKED,
  SEARCH_BAR_CHANGED,
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
  const token = authentication.getToken();
  const forceHttp = isOnHostMappedDomain() && location.protocol === 'http:';
  const queryParams = _.extend(query, settings.get('helpCenter.filter'));

  return {
    method: 'get',
    forceHttp: forceHttp,
    useHostMappingIfAvailable: true,
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
  const json = response.body;
  const articles = json.results;

  return {
    articles,
    resultsCount: json.count
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
      payload: {}
    });

    http.send(constructHelpCenterPayload(path, query, doneFn, failFn));
  };
}

export function performContextualSearch(query, done = () => {}, fail = () => {}) {
  const path = '/api/v2/help_center/articles/embeddable_search.json';

  return (dispatch) => {
    const doneFn = (response) => {
      dispatch({ type: CONTEXTUAL_SEARCH_REQUEST_SUCCESS, payload: formatResults(response) });

      done(response);
    };
    const failFn = (error) => {
      dispatch({ type: CONTEXTUAL_SEARCH_REQUEST_FAILURE });
      fail(error);
    };

    dispatch({ type: CONTEXTUAL_SEARCH_REQUEST_SENT });

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

export function updateSearchTerm(term) {
  return {
    type: SEARCH_BAR_CHANGED,
    payload: term
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

    http.get({
      method: 'get',
      path: `/api/v2/help_center/articles/${articleId}.json`,
      useHostMappingIfAvailable: true,
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
