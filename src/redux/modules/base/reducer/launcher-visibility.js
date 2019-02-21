import {
  LAUNCHER_CLICKED,
  CHAT_BADGE_CLICKED,
  CLOSE_BUTTON_CLICKED,
  LEGACY_SHOW_RECEIVED,
  ACTIVATE_RECEIVED,
  NEXT_BUTTON_CLICKED,
  CANCEL_BUTTON_CLICKED,
  OPEN_RECEIVED,
  CLOSE_RECEIVED,
  TOGGLE_RECEIVED,
  WIDGET_INITIALISED,
  POPOUT_BUTTON_CLICKED } from '../base-action-types';
import {
  ZOPIM_HIDE,
  ZOPIM_SHOW,
  ZOPIM_ON_CLOSE } from '../../zopimChat/zopimChat-action-types';
import {
  PROACTIVE_CHAT_RECEIVED,
  CHAT_WINDOW_OPEN_ON_NAVIGATE,
  PROACTIVE_CHAT_NOTIFICATION_DISMISSED } from '../../chat/chat-action-types';
import { isMobileBrowser } from 'utility/devices';
import { isPopout } from 'utility/globals';

const initialState = true;

const launcherVisible = (state = initialState, action) => {
  const { type } = action;

  switch (type) {
    case LAUNCHER_CLICKED:
    case CHAT_BADGE_CLICKED:
    case ACTIVATE_RECEIVED:
    case PROACTIVE_CHAT_RECEIVED:
    case CHAT_WINDOW_OPEN_ON_NAVIGATE:
    case OPEN_RECEIVED:
      return false;
    case CLOSE_BUTTON_CLICKED:
    case POPOUT_BUTTON_CLICKED:
    case ZOPIM_HIDE:
    case LEGACY_SHOW_RECEIVED:
    case CANCEL_BUTTON_CLICKED:
    case ZOPIM_ON_CLOSE:
    case PROACTIVE_CHAT_NOTIFICATION_DISMISSED:
    case CLOSE_RECEIVED:
      return true;
    case ZOPIM_SHOW:
    case NEXT_BUTTON_CLICKED:
      return isMobileBrowser();
    case WIDGET_INITIALISED:
      return !isPopout();
    case TOGGLE_RECEIVED:
      return !state;
    default:
      return state;
  }
};

export default launcherVisible;
