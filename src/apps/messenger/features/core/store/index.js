import { createSlice } from '@reduxjs/toolkit'

const core = createSlice({
  name: 'core',
  initialState: { isMessengerOpen: false },
  reducers: {
    messengerClose: state => {
      state.isMessengerOpen = false
    },
    messengerOpen: state => {
      state.isMessengerOpen = true
    },
    messengerToggle: state => {
      state.isMessengerOpen = !state.isMessengerOpen
    }
  }
})

export const { messengerClose, messengerOpen, messengerToggle } = core.actions

export const getIsMessengerOpen = state => state.core.isMessengerOpen

export default core.reducer
