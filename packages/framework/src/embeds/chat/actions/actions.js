import * as actionTypes from './action-types'

export function updateMenuVisibility(visible) {
  return {
    type: actionTypes.UPDATE_CHAT_MENU_VISIBILITY,
    payload: visible,
  }
}

export const handleSoundIconClick = (settings) => {
  return {
    type: actionTypes.SOUND_ICON_CLICKED,
    payload: settings,
  }
}
