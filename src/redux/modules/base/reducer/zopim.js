import { UPDATE_ZOPIM_ONLINE } from '../base-action-types';

const initialState = false;

const zopim = (state = initialState, action) => {
  const { type, payload } = action;

  switch (type) {
    case UPDATE_ZOPIM_ONLINE:
      return payload;
    default:
      return state;
  }
};

export default zopim;
