import {
  BACK_CLICK,
  NEXT_CLICK,
  CANCEL_CLICK
} from './root-action-types';

export const onBackClick = () => {
  return { type: BACK_CLICK };
};
