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
         UPDATE_SEARCH_TERM } from './helpCenter-action-types';

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

export function updateActiveArticle() {
  return { type: UPDATE_ACTIVE_ARTICLE };
}

export function updateSearchTerm(term) {
  return {
    type: UPDATE_SEARCH_TERM,
    payload: term
  };
}
