import { LAUNCHER_CLICKED, CLOSE_BUTTON_CLICKED } from '../base-action-types';
import { ZOPIM_HIDE, ZOPIM_SHOW } from 'src/redux/modules/zopimChat/zopimChat-action-types';
import { isMobileBrowser } from 'utility/devices';

const initialState = true;

const launcherVisible = (state = initialState, action) => {
  const { type } = action;

  switch (type) {
    case CLOSE_BUTTON_CLICKED:
      return true;
    case LAUNCHER_CLICKED:
      return false;
    case ZOPIM_HIDE:
      return true;
    case ZOPIM_SHOW:
      return isMobileBrowser() ? true : false;
    default:
      return state;
  }
};

export default launcherVisible;
