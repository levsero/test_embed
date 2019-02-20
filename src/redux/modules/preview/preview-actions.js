import {
  PREVIEW_CHOICE_SELECTED
} from './preview-action-types';

export const choosePreview = (preview) => {
  return {
    type: PREVIEW_CHOICE_SELECTED,
    payload: preview
  };
};
