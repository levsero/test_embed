import { LOCALE_SET } from '../base-action-types';

const initialState = '';

const locale = (state = initialState, action) => {
  const { type, payload } = action;

  switch (type) {
    case LOCALE_SET:
      return payload;
    default:
      return state;
  }
};

export default locale;
