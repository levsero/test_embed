import { createSlice } from '@reduxjs/toolkit'
import { store as persistence } from 'src/framework/services/persistence'

const widgetOpenKey = 'widgetOpen'

const visibility = createSlice({
  name: 'visibility',
  initialState: {
    widgetOpen: Boolean(persistence.sessionStorageGet(widgetOpenKey))
  },
  reducers: {
    widgetClosed: state => {
      persistence.sessionStorageSet(widgetOpenKey, false)
      state.widgetOpen = false
    },
    widgetOpened: state => {
      persistence.sessionStorageSet(widgetOpenKey, true)
      state.widgetOpen = true
    },
    widgetToggled: state => {
      persistence.sessionStorageSet(widgetOpenKey, !state.widgetOpen)
      state.widgetOpen = !state.widgetOpen
    }
  }
})

export const { widgetClosed, widgetOpened, widgetToggled } = visibility.actions

const getIsWidgetOpen = state => state.visibility.widgetOpen

export { getIsWidgetOpen }

export default visibility.reducer
