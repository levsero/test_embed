import { ZOPIM_CONNECTED } from '../zopimChat-action-types';

const initialState = false;
const connected = (state = initialState, action) => {
  switch (action.type) {
    case ZOPIM_CONNECTED:
      return true;
    default:
      return state;
  }
};

export default connected;
