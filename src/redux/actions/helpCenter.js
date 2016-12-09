import { authentication } from 'service/authentication';
import { transport } from 'service/transport';

export function updateSearchTerm(searchTerm) {
  return {
    type: 'UPDATE_SEARCH_TERM',
    payload: { searchTerm }
  };
}

export function searchRequest() {
  return {
    type: 'SEARCH_REQUEST',
    payload: {}
  };
}

export function searchSuccess(response) {
  return {
    type: 'SEARCH_SUCCESS',
    payload: {
      response
    }
  };
}

export function searchFailure(error) {
  return {
    type: 'SEARCH_FAILURE',
    payload: {
      error
    }
  };
}

export function performSearch(query) {
  return (dispatch) => {
    const doneFn = (response) => {
      dispatch(searchSuccess(response));
    };
    const failFn = (error) => {
      dispatch(searchFailure(error));
    };
    const token = authentication.getToken();

    dispatch(searchRequest());

    transport.send({
      method: 'get',
      path: '/api/v2/help_center/search.json',
      query: query,
      authorization: token ? `Bearer ${token}` : '',
      callbacks: {
        done: doneFn,
        fail: failFn
      }
    });
  };
}
