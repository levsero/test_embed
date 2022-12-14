import { SOUND_ICON_CLICKED } from 'classicSrc/embeds/chat/actions/action-types'
import { GET_ACCOUNT_SETTINGS_REQUEST_SUCCESS } from 'classicSrc/redux/modules/chat/chat-action-types'

const initialState = true

const soundEnabled = (state = initialState, action) => {
  switch (action.type) {
    case SOUND_ICON_CLICKED:
      return action.payload.sound
    case GET_ACCOUNT_SETTINGS_REQUEST_SUCCESS:
      const isDisabled = action.payload?.sound?.disabled
      if (isDisabled !== undefined) {
        return !isDisabled
      }

      return state
    default:
      return state
  }
}

export default soundEnabled
