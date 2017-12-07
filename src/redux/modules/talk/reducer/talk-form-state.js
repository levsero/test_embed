import { UPDATE_CALLBACK_FORM } from '../talk-action-types';

const initialState = {};

const formState = (state = initialState, action) => {
  switch (action.type) {
    case UPDATE_CALLBACK_FORM:
      return action.payload;
    default:
      return state;
  }
};

export default formState;
