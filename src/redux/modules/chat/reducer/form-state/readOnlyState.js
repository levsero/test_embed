import { PREFILL_RECEIVED } from '../../../base/base-action-types';

const initialState = {
  name: false,
  email: false,
  phone: false
};

const readOnlyState = (state = initialState, action) => {
  const { type, payload } = action;

  switch (type) {
    case PREFILL_RECEIVED:
      return {
        ...state,
        ...payload.isReadOnly
      };
    default:
      return state;
  }
};

export default readOnlyState;
