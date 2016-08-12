import _ from 'lodash';

const initialState = {
  searchTerm: ''
};

export default function reducer(state = initialState, action = {}) {
  const { type, payload } = action;

  switch (type) {
    case 'UPDATE_SEARCH_TERM':
      return _.merge({}, state, { searchTerm: payload.searchTerm });
    default:
      return state;
  }
};
