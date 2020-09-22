import { createReducer } from '@reduxjs/toolkit'
import { DEFAULT_THEME } from '@zendeskgarden/react-theming'
import { messengerConfigReceived } from 'src/apps/messenger/store/actions'
import { readableColor } from 'polished'

const getReadableMessengerColor = color => {
  return readableColor(color, DEFAULT_THEME.palette.grey[800], DEFAULT_THEME.palette.white, false)
}

const store = createReducer(
  {
    colors: {
      primary: DEFAULT_THEME.palette.kale[600],
      primaryText: getReadableMessengerColor(DEFAULT_THEME.palette.kale[600]),
      message: DEFAULT_THEME.palette.kale[700],
      messageText: getReadableMessengerColor(DEFAULT_THEME.palette.kale[700]),
      action: DEFAULT_THEME.palette.mint[400],
      actionText: getReadableMessengerColor(DEFAULT_THEME.palette.mint[400]),
      otherParticipantMessage: '#f4f6f8',
      otherParticipantMessageText: getReadableMessengerColor('#f4f6f8'),
      otherParticipantMessageBorder: DEFAULT_THEME.palette.grey[200]
    },
    position: 'right'
  },
  {
    [messengerConfigReceived]: (state, action) => {
      const configColors = action.payload?.color

      if (configColors?.primary) {
        state.colors.primary = configColors.primary
        state.colors.primaryText = getReadableMessengerColor(configColors.primary)
      }

      if (configColors?.message) {
        state.colors.message = configColors.message
        state.colors.messageText = getReadableMessengerColor(configColors.message)
      }

      if (configColors?.action) {
        state.colors.action = configColors.action
        state.colors.actionText = getReadableMessengerColor(configColors.action)
      }

      if (action.payload?.position === 'left' || action.payload?.position === 'right') {
        state.position = action.payload?.position
      }
    }
  }
)

export const getMessengerColors = state => state.theme.colors
export const getPosition = state => state.theme.position

export default store
