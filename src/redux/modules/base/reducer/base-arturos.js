import { UPDATE_ARTUROS } from '../base-action-types';

const initialState = {};

const arturos = (state = initialState, action) => {
  const { type, payload } = action;

  switch (type) {
    case UPDATE_ARTUROS:
      return {
        ...state,
        ...payload
      };
    default:
      return state;
  }
};

export default arturos;
