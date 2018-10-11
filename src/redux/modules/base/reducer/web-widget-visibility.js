import {
  LAUNCHER_CLICKED,
  CLOSE_BUTTON_CLICKED,
  LEGACY_SHOW_RECIEVED,
  ACTIVATE_RECIEVED } from '../base-action-types';
import { ZOPIM_SHOW } from 'src/redux/modules/zopimChat/zopimChat-action-types';

const initialState = false;

const webWidgetVisible = (state = initialState, action) => {
  const { type } = action;

  switch (type) {
    case LAUNCHER_CLICKED:
    case ACTIVATE_RECIEVED:
      return true;
    case CLOSE_BUTTON_CLICKED:
    case ZOPIM_SHOW:
    case LEGACY_SHOW_RECIEVED:
      return false;
    default:
      return state;
  }
};

export default webWidgetVisible;
