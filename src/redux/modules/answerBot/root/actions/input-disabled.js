import { INPUT_DISABLED } from '../action-types';

export const inputDisabled = (disabled) => {
  return {
    type: INPUT_DISABLED,
    payload: !!disabled
  };
};
