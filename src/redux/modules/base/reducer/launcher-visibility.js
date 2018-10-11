import {
  LAUNCHER_CLICKED,
  CLOSE_BUTTON_CLICKED,
  LEGACY_SHOW_RECIEVED,
  ACTIVATE_RECIEVED } from '../base-action-types';
import { ZOPIM_HIDE, ZOPIM_SHOW } from 'src/redux/modules/zopimChat/zopimChat-action-types';
import { isMobileBrowser } from 'utility/devices';

const initialState = true;

const launcherVisible = (state = initialState, action) => {
  const { type } = action;

  switch (type) {
    case LAUNCHER_CLICKED:
    case ACTIVATE_RECIEVED:
      return false;
    case CLOSE_BUTTON_CLICKED:
    case ZOPIM_HIDE:
    case LEGACY_SHOW_RECIEVED:
      return true;
    case ZOPIM_SHOW:
      return isMobileBrowser() ? true : false;
    default:
      return state;
  }
};

export default launcherVisible;
