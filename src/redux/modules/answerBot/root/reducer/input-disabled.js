import { INPUT_DISABLED } from '../action-types';

const initialState = false;

const inputDisabled = (state = initialState, action) => {
  switch (action.type) {
    case INPUT_DISABLED:
      return action.payload;
    default:
      return state;
  }
};

export default inputDisabled;
