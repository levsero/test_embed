import {
  ZOPIM_ON_OPEN,
  ZOPIM_ON_CLOSE } from '../zopimChat-action-types';

const initialState = false;

const isOpen = (state = initialState, action) => {
  const { type } = action;

  switch (type) {
    case ZOPIM_ON_OPEN:
      return true;
    case ZOPIM_ON_CLOSE:
      return initialState;
    default:
      return state;
  }
};

export default isOpen;
