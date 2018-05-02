import {
  UPDATE_SETTINGS_CHAT_SUPPRESS,
  RESET_SETTINGS_CHAT_SUPPRESS,
  UPDATE_SETTINGS
} from './settings-action-types';

export function updateSettingsChatSuppress(bool) {
  return {
    type: UPDATE_SETTINGS_CHAT_SUPPRESS,
    payload: bool
  };
}

export function resetSettingsChatSuppress() {
  return { type: RESET_SETTINGS_CHAT_SUPPRESS };
}

export function updateSettings (settings) {
  return {
    type: UPDATE_SETTINGS,
    payload: settings
  };
}
