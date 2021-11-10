import { createSlice } from '@reduxjs/toolkit'
import { launcherShapes } from 'src/apps/messenger/constants'
import {
  getIsFullScreen,
  getIsVerticallySmallScreen,
} from 'src/apps/messenger/features/responsiveDesign/store'
import { messengerConfigReceived } from 'src/apps/messenger/store/actions'
import { getIsWidgetOpen } from 'src/apps/messenger/store/visibility'

const launcherConfig = createSlice({
  name: 'launcherConfig',
  initialState: {
    shape: launcherShapes.square,
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
  if (getIsWidgetOpen(state) && (getIsVerticallySmallScreen(state) || getIsFullScreen(state))) {
    return false
  }

  return true
}

const getLauncherShape = (state) => state.launcher.shape

export { getIsLauncherVisible, getLauncherShape }
