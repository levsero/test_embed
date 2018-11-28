import {
  LAUNCHER_CLICKED,
  CHAT_BADGE_CLICKED,
  CLOSE_BUTTON_CLICKED,
  LEGACY_SHOW_RECEIVED,
  ACTIVATE_RECEIVED,
  CANCEL_BUTTON_CLICKED,
  OPEN_RECEIVED,
  CLOSE_RECEIVED,
  TOGGLE_RECEIVED } from '../base-action-types';
import {
  ZOPIM_SHOW,
  ZOPIM_CHAT_GONE_OFFLINE } from '../../zopimChat/zopimChat-action-types';
import {
  PROACTIVE_CHAT_RECEIVED,
  CHAT_WINDOW_OPEN_ON_NAVIGATE,
  PROACTIVE_CHAT_NOTIFICATION_DISMISSED } from '../../chat/chat-action-types';

const initialState = false;

const webWidgetVisible = (state = initialState, action) => {
  const { type } = action;

  switch (type) {
    case LAUNCHER_CLICKED:
    case CHAT_BADGE_CLICKED:
    case ACTIVATE_RECEIVED:
    case PROACTIVE_CHAT_RECEIVED:
    case CHAT_WINDOW_OPEN_ON_NAVIGATE:
    case OPEN_RECEIVED:
    case ZOPIM_CHAT_GONE_OFFLINE:
      return true;
    case CLOSE_BUTTON_CLICKED:
    case ZOPIM_SHOW:
    case LEGACY_SHOW_RECEIVED:
    case CANCEL_BUTTON_CLICKED:
    case PROACTIVE_CHAT_NOTIFICATION_DISMISSED:
    case CLOSE_RECEIVED:
      return false;
    case TOGGLE_RECEIVED:
      return !state;
    default:
      return state;
  }
};

export default webWidgetVisible;
