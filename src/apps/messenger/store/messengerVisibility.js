import { createSlice } from '@reduxjs/toolkit'

const messengerVisibility = createSlice({
  name: 'messengerVisibility',
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

export const { messengerClose, messengerOpen, messengerToggle } = messengerVisibility.actions

// Selectors

const getIsMessengerOpen = state => state.messengerVisibility.isMessengerOpen

export { getIsMessengerOpen }

export default messengerVisibility.reducer
