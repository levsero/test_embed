import { TALK_VENDOR_LOADED } from '../talk-action-types';

const initialState = {
  io: null,
  libphonenumber: null
};

const vendor = (state = initialState, action = {}) => {
  const { type, payload } = action;

  switch (type) {
    case TALK_VENDOR_LOADED:
      return { ...state, ...payload };
    default:
      return state;
  }
};

export default vendor;
