import { UPDATE_EMBED_SHOWN } from '../base-action-types';

const initialState = false;

const embedShown = (state = initialState, action) => {
  const { type, payload } = action;

  switch (type) {
    case UPDATE_EMBED_SHOWN:
      return payload;
    default:
      return state;
  }
};

export default embedShown;
