import { BOOT_UP_TIMER_COMPLETE } from '../base-action-types';

const initialState = false;
const bootupTimeout = (state = initialState, action) => {
  const { type } = action;

  switch (type) {
    case BOOT_UP_TIMER_COMPLETE:
      return true;
    default:
      return state;
  }
};

export default bootupTimeout;
