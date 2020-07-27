import { createSlice } from '@reduxjs/toolkit'

const core = createSlice({
  name: 'core',
  initialState: { open: false },
  reducers: {
    widgetCloseAction: state => ({ ...state, open: false }),
    widgetOpenAction: state => ({ ...state, open: true }),
    widgetToggleAction: state => {
      const isOpen = state.open ? false : true
      return { ...state, open: isOpen }
    }
  }
})

export const { widgetCloseAction, widgetOpenAction, widgetToggleAction } = core.actions

export const getIsWidgetOpen = state => state.core.open

export default core.reducer
