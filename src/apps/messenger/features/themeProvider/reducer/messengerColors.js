import { createReducer } from '@reduxjs/toolkit'
import { DEFAULT_THEME } from '@zendeskgarden/react-theming'
import { messengerConfigReceived } from 'src/apps/messenger/store/actions'

const messengerColors = createReducer(
  {
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
  {
    [messengerConfigReceived]: (state, action) => {
      state.primary = action.payload?.color?.primary || state.primary
      state.message = action.payload?.color?.message || state.message
      state.action = action.payload?.color?.action || state.action
    }
  }
)

export const getMessengerColors = state => state.messengerColors

export default messengerColors
