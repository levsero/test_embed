import { SCREEN_CHANGED } from '../action-types';

export const screenChanged = (screen) => {
  return {
    type: SCREEN_CHANGED,
    payload: screen
  };
};
