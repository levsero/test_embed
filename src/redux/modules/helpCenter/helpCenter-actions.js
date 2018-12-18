import _ from 'lodash';

import { http } from 'service/transport';
import { location } from 'utility/globals';
import { getAuthToken,
  getHasWidgetShown,
  getHasPassedAuth,
  getIsAuthenticationPending } from 'src/redux/modules/base/base-selectors';
import { getLastSearchTimestamp,
  getContextualHelpRequestNeeded,
  getSearchQuery } from 'src/redux/modules/helpCenter/helpCenter-selectors';
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
  SEARCH_FIELD_FOCUSED,
  CONTEXTUAL_SUGGESTIONS_MANUALLY_SET } from './helpCenter-action-types';
import { updateQueue } from 'src/redux/modules/base';
import { isOnHostMappedDomain } from 'utility/pages';
import { getSettingsHelpCenterFilter } from 'src/redux/modules/settings/settings-selectors';

const constructHelpCenterPayload = (path, query, doneFn, failFn, filter) => {
  const token = getAuthToken();
  const forceHttp = isOnHostMappedDomain() && location.protocol === 'http:';
  const queryParams = _.extend(query, filter);

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
    resultsCount: count,
    locale: results.length > 0 ? results[0].locale : ''
  };
};

const preventSearchCompleteDispatch = (getState, timestamp) => {
  /* This is implemented in order to prevent slow connections from returning
     successful responses in quick succession which causes screen states to
     flicker on the front-end which causes a weird experience and could potentially
     render an incorrect state. To prevent that we only dispatch the promised callbacks
     if it's the last message recorded via its ID. */
  return timestamp !== getLastSearchTimestamp(getState());
};

export function performImageSearch(path, done) {
  http.getImage(constructHelpCenterPayload(path, null, done));

  // Temporary to stop middleware from breaking until we properly implement images
  return ({ type: '' });
}

export function performSearch(query, done = () => {}, fail = () => {}) {
  const timestamp = Date.now();
  const path = '/api/v2/help_center/search.json';

  return (dispatch, getState) => {
    const doneFn = (response) => {
      if (preventSearchCompleteDispatch(getState, timestamp)) return;

      dispatch({
        type: SEARCH_REQUEST_SUCCESS,
        payload: formatResults(response)
      });

      done(response);
    };
    const failFn = (error) => {
      if (preventSearchCompleteDispatch(getState, timestamp)) return;

      dispatch({ type: SEARCH_REQUEST_FAILURE });
      fail(error);
    };

    dispatch({
      type: SEARCH_REQUEST_SENT,
      payload: { searchTerm: query.query, timestamp }
    });

    const filter = getSettingsHelpCenterFilter(getState());

    http.send(constructHelpCenterPayload(path, query, doneFn, failFn, filter));
  };
}

export function contextualSearch(onDone) {
  return (dispatch, getState) => {
    const state = getState();

    if (getContextualHelpRequestNeeded(state)) {
      if (getHasPassedAuth(state)) {
        dispatch(performContextualSearch(onDone, onDone));
      } else if (getIsAuthenticationPending(state)) {
        dispatch(updateQueue({ performContextualSearch: {} }));
      }
    }
  };
}

export function performContextualSearch(done = () => {}, fail = () => {}) {
  const timestamp = Date.now();

  return (dispatch, getState) => {
    const searchQuery = getSearchQuery(getState());

    if (!searchQuery.query && !searchQuery.label_names) {
      return;
    } // eslint-disable-line camelcase

    const path = '/api/v2/help_center/articles/embeddable_search.json';
    /* eslint camelcase:0 */
    let query = {
      locale: i18n.getLocale(),
      per_page: MAXIMUM_CONTEXTUAL_SEARCH_RESULTS,
      ...searchQuery
    };

    const doneFn = (response) => {
      if (preventSearchCompleteDispatch(getState, timestamp)) return;

      dispatch({ type: CONTEXTUAL_SEARCH_REQUEST_SUCCESS, payload: formatResults(response) });
      done(response);
    };
    const failFn = (error) => {
      if (preventSearchCompleteDispatch(getState, timestamp)) return;

      dispatch({ type: CONTEXTUAL_SEARCH_REQUEST_FAILURE });
      fail(error);
    };

    dispatch({
      type: CONTEXTUAL_SEARCH_REQUEST_SENT,
      payload: {
        searchTerm: searchQuery.query || searchQuery.label_names,
        timestamp
      }
    });

    const filter = getSettingsHelpCenterFilter(getState());

    http.send(constructHelpCenterPayload(path, query, doneFn, failFn, filter));
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

export function setContextualSuggestionsManually(options, onDone) {
  return (dispatch, getState) => {
    dispatch({
      type: CONTEXTUAL_SUGGESTIONS_MANUALLY_SET,
      payload: options
    });

    if (getHasWidgetShown(getState())) {
      dispatch(contextualSearch(onDone));
    }
  };
}
