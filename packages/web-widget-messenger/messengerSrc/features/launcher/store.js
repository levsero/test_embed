import { createSlice } from '@reduxjs/toolkit'
import { LAUNCHER_SHAPES } from '@zendesk/conversation-components'
import {
  getIsFullScreen,
  getIsVerticallySmallScreen,
} from 'messengerSrc/features/responsiveDesign/store'
import { messengerConfigReceived } from 'messengerSrc/store/actions'
import { getIsWidgetOpen } from 'messengerSrc/store/visibility'

const launcherConfig = createSlice({
  name: 'launcherConfig',
  initialState: {
    shape: LAUNCHER_SHAPES.square,
  },
  extraReducers: {
    [messengerConfigReceived](state, action) {
      if (action.payload?.launcher?.shape) {
        state.shape = action.payload.launcher.shape
      }
    },
  },
})

export default launcherConfig.reducer

const getIsLauncherVisible = (state) => {
  if (
    state.launcher.shape === LAUNCHER_SHAPES.none ||
    (getIsWidgetOpen(state) && (getIsVerticallySmallScreen(state) || getIsFullScreen(state)))
  ) {
    return false
  }

  return true
}

const getLauncherShape = (state) => state.launcher.shape

export { getIsLauncherVisible, getLauncherShape }
