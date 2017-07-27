import { UPDATE_HELP_CENTER_AUTHENTICATED } from './helpCenter-action-types';

export const updateHelpCenterAuth = (bool) => {
  return {
    type: UPDATE_HELP_CENTER_AUTHENTICATED,
    payload: bool
  };
};
