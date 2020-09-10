import { createReducer } from '@reduxjs/toolkit'
import { DEFAULT_THEME } from '@zendeskgarden/react-theming'
import { messengerConfigReceived } from 'src/apps/messenger/store/actions'

const store = createReducer(
  {
    colors: {
      action: '#17494D',
      actionText: DEFAULT_THEME.palette.grey['200'],
      primary: '#17494D',
      primaryMessage: '#f4f6f8',
      primaryMessageText: DEFAULT_THEME.palette.grey['800'],
      primaryText: DEFAULT_THEME.palette.grey['200'],
      message: '#00363D',
      messageText: DEFAULT_THEME.palette.grey['200'],
      messageBorder: DEFAULT_THEME.palette.grey['200']
    },
    position: 'right'
  },
  {
    [messengerConfigReceived]: (state, action) => {
      state.colors.primary = action.payload?.color?.primary || state.colors.primary
      state.colors.message = action.payload?.color?.message || state.colors.message
      state.colors.action = action.payload?.color?.action || state.colors.action

      if (action.payload?.position === 'left' || action.payload?.position === 'right') {
        state.position = action.payload?.position
      }
    }
  }
)

export const getMessengerColors = state => state.theme.colors
export const getPosition = state => state.theme.position

export default store
