import { UPDATE_PHONE_NUMBER } from '../talk-action-types';

const initialState = '';

const phoneNumber = (state = initialState, action) => {
  switch (action.type) {
    case UPDATE_PHONE_NUMBER:
      return action.payload;
    default:
      return state;
  }
};

export default phoneNumber;
