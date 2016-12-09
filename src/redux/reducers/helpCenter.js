import _ from 'lodash';

const initialState = {
  searched: false,
  searchValue: '',
  searchTerm: '',
  results: [],
  error: null,
  loading: false
};

export default function reducer(state = initialState, action = {}) {
  const { type, payload } = action;

  /* eslint-disable indent */
  switch (type) {
    case 'UPDATE_SEARCH_TERM': {
      return _.extend({}, state, {
        searchValue: payload.searchTerm
      });
    }
    case 'SEARCH_REQUEST': {
      const searchTerm = state.searchValue;

      return _.extend({}, state, {
        searchTerm,
        loading: true
      });
    }
    case 'SEARCH_SUCCESS': {
      const json = payload.response.body;

      return _.extend({}, state, {
        searched: true,
        loading: false,
        results: json.results
      });
    }
    case 'SEARCH_FAILURE': {
      return _.extend({}, state, {
        searched: true,
        loading: false,
        error: payload.error.message
      });
    }
    default:
      return state;
  }
}
