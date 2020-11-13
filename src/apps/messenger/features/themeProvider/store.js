import { createReducer } from '@reduxjs/toolkit'
import { messengerConfigReceived } from 'src/apps/messenger/store/actions'

const store = createReducer(
  {
    colors: {},
    position: 'right'
  },
  {
    [messengerConfigReceived]: (state, action) => {
      const configColors = action.payload?.color

      if (configColors?.primary) {
        state.colors.primary = configColors.primary
      }

      if (configColors?.message) {
        state.colors.message = configColors.message
      }

      if (configColors?.action) {
        state.colors.action = configColors.action
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
