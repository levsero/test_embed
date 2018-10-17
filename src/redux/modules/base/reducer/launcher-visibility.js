import {
  LAUNCHER_CLICKED,
  CLOSE_BUTTON_CLICKED,
  LEGACY_SHOW_RECIEVED,
  ACTIVATE_RECIEVED,
  NEXT_BUTTON_CLICKED,
  CANCEL_BUTTON_CLICKED } from '../base-action-types';
import {
  ZOPIM_HIDE,
  ZOPIM_SHOW,
  ZOPIM_ON_CLOSE } from 'src/redux/modules/zopimChat/zopimChat-action-types';
import {
  PROACTIVE_CHAT_RECEIVED,
  CHAT_WINDOW_OPEN_ON_NAVIGATE } from 'src/redux/modules/chat/chat-action-types';
import { isMobileBrowser } from 'utility/devices';

const initialState = true;

const launcherVisible = (state = initialState, action) => {
  const { type } = action;

  switch (type) {
    case LAUNCHER_CLICKED:
    case ACTIVATE_RECIEVED:
    case PROACTIVE_CHAT_RECEIVED:
    case CHAT_WINDOW_OPEN_ON_NAVIGATE:
      return false;
    case CLOSE_BUTTON_CLICKED:
    case ZOPIM_HIDE:
    case LEGACY_SHOW_RECIEVED:
    case CANCEL_BUTTON_CLICKED:
    case ZOPIM_ON_CLOSE:
      return true;
    case ZOPIM_SHOW:
    case NEXT_BUTTON_CLICKED:
      return isMobileBrowser() ? true : false;
    default:
      return state;
  }
};

export default launcherVisible;
