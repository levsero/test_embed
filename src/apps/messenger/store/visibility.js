import { createSlice } from '@reduxjs/toolkit'

const visibility = createSlice({
  name: 'visibility',
  initialState: {
    widgetOpen: false
  },
  reducers: {
    widgetClosed: state => {
      state.widgetOpen = false
    },
    widgetOpened: state => {
      state.widgetOpen = true
    },
    widgetToggled: state => {
      state.widgetOpen = !state.widgetOpen
    }
  }
})

export const { widgetClosed, widgetOpened, widgetToggled } = visibility.actions

const getIsWidgetOpen = state => state.visibility.widgetOpen

export { getIsWidgetOpen }

export default visibility.reducer
