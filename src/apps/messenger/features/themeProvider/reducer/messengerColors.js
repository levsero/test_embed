import { createReducer } from '@reduxjs/toolkit'
import { DEFAULT_THEME } from '@zendeskgarden/react-theming'
import { configReceived } from 'src/apps/messenger/store/actions'

const messengerColors = createReducer(
  {
    actionColor: '#17494D',
    actionTextColor: DEFAULT_THEME.palette.grey['200'],
    brandColor: '#17494D',
    brandMessageColor: '#f4f6f8',
    brandMessageTextColor: DEFAULT_THEME.palette.grey['800'],
    brandTextColor: DEFAULT_THEME.palette.grey['200'],
    conversationColor: '#00363D',
    conversationTextColor: DEFAULT_THEME.palette.grey['200'],
    messageBorder: DEFAULT_THEME.palette.grey['200']
  },
  {
    [configReceived]: (state, action) => {
      state.brandColor = action.payload?.brandColor || state.brandColor
      state.conversationColor = action.payload?.messageColor || state.conversationColor
      state.actionColor = action.payload?.actionColor || state.actionColor
    }
  }
)

export const getMessengerColors = state => state.messengerColors

export default messengerColors
