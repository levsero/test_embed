import { createSlice } from '@reduxjs/toolkit'

const core = createSlice({
  name: 'core',
  initialState: { open: false },
  reducers: {
    widgetClose: state => {
      state.open = false
    },
    widgetOpen: state => {
      state.open = true
    },
    widgetToggle: state => {
      state.open = !state.open
    }
  }
})

export const { widgetClose, widgetOpen, widgetToggle } = core.actions

export const getIsWidgetOpen = state => state.core.open

export default core.reducer
