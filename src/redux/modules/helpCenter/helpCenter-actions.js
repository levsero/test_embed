import _ from 'lodash';

import { authentication } from 'service/authentication';
import { http } from 'service/transport';
import { settings } from 'service/settings';
import { location } from 'utility/globals';
import { isOnHostMappedDomain } from 'utility/pages';

import { SEARCH_REQUEST,
         SEARCH_SUCCESS,
         SEARCH_FAILURE,
         CONTEXTUAL_SEARCH_REQUEST,
         CONTEXTUAL_SEARCH_SUCCESS,
         CONTEXTUAL_SEARCH_SUCCESS_NO_RESULTS,
         UPDATE_ACTIVE_ARTICLE,
         UPDATE_SEARCH_TERM,
         UPDATE_RESULTS,
         UPDATE_VIEW_MORE_CLICKED,
         ORIGINAL_ARTICLE_CLICKED,
         RESET_ACTIVE_ARTICLE,
         ADD_RESTRICTED_IMAGE,
         UPDATE_CHANNELCHOICE_SHOWN,
         UPDATE_SEARCH_FIELD_VALUE } from './helpCenter-action-types';

const constructHelpCenterPayload = (path, query, doneFn, failFn) => {
  const token = authentication.getToken();
  const forceHttp = isOnHostMappedDomain() && location.protocol === 'http:';
  const queryParams = _.extend(query, settings.get('helpCenter.filter'));

  return {
    method: 'get',
    forceHttp: forceHttp,
    path,
    query: queryParams,
    authorization: token ? `Bearer ${token}` : '',
    callbacks: {
      done: doneFn,
      fail: failFn
    }
  };
};

const updateResults = (response) => {
  const json = response.body;
  const articles = json.results;

  return {
    type: UPDATE_RESULTS,
    payload: {
      articles,
      resultsCount: json.count
    }
  };
};

export function performImageSearch(path, done) {
  http.getImage(constructHelpCenterPayload(path, null, done));

  // Temporary to stop middleware from breaking until we properly implement images
  return({ type: '' });
}

export function performSearch(query, done = () => {}, fail = () => {}) {
  const path = '/api/v2/help_center/search.json';

  return (dispatch) => {
    const doneFn = (response) => {
      dispatch({
        type: SEARCH_SUCCESS,
        payload: { response }
      });

      dispatch(updateResults(response));
      done(response);
    };
    const failFn = (error) => {
      dispatch({ type: SEARCH_FAILURE });
      fail(error);
    };

    dispatch({
      type: SEARCH_REQUEST,
      payload: {}
    });

    http.send(constructHelpCenterPayload(path, query, doneFn, failFn));
  };
}

export function performContextualSearch(query, done = () => {}, fail = () => {}) {
  const path = '/api/v2/help_center/articles/embeddable_search.json';

  return (dispatch) => {
    const doneFn = (response) => {
      (response.body.count === 0)
        ? dispatch({ type: CONTEXTUAL_SEARCH_SUCCESS_NO_RESULTS })
        : dispatch({ type: CONTEXTUAL_SEARCH_SUCCESS, payload: { response } });

      dispatch(updateResults(response));
      done(response);
    };
    const failFn = (error) => {
      dispatch({ type: SEARCH_FAILURE });
      fail(error);
    };

    dispatch({ type: CONTEXTUAL_SEARCH_REQUEST });

    http.send(constructHelpCenterPayload(path, query, doneFn, failFn));
  };
}

export function handleOriginalArticleClicked() {
  return {
    type: ORIGINAL_ARTICLE_CLICKED
  };
}

export function updateActiveArticle(article) {
  return {
    type: UPDATE_ACTIVE_ARTICLE,
    payload: article
  };
}

export function updateSearchTerm(term) {
  return {
    type: UPDATE_SEARCH_TERM,
    payload: term
  };
}

export function updateViewMoreClicked() {
  return { type: UPDATE_VIEW_MORE_CLICKED };
}

export function resetActiveArticle() {
  return { type: RESET_ACTIVE_ARTICLE };
}

export function addRestrictedImage(img) {
  return {
    type: ADD_RESTRICTED_IMAGE,
    payload: img
  };
}

export function updateChannelChoiceShown(bool) {
  return {
    type: UPDATE_CHANNELCHOICE_SHOWN,
    payload: bool
  };
}

export function updateSearchFieldValue(value) {
  return {
    type: UPDATE_SEARCH_FIELD_VALUE,
    payload: value
  };
}
