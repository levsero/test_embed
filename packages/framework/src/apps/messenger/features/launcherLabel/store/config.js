import { createSlice } from '@reduxjs/toolkit'
import { messengerConfigReceived } from 'src/apps/messenger/store/actions'

const launcherLabelConfig = createSlice({
  name: 'launcherLabelConfig',
  initialState: {
    isVisibleOnMobile: false,
    text: '',
  },
  extraReducers: {
    [messengerConfigReceived](state, action) {
      if (action.payload?.launcher) {
        if (typeof action.payload.launcher.text === 'string') {
          state.text = action.payload.launcher.text.trim()
        }

        state.isVisibleOnMobile = Boolean(action.payload.launcher.showTextInMobile)
      }
    },
  },
})

const getLauncherLabelText = (state) => state.launcherLabel.config.text

const getIsVisibleOnSmallDevices = (state) => state.launcherLabel.config.isVisibleOnMobile

export default launcherLabelConfig.reducer

export { getLauncherLabelText, getIsVisibleOnSmallDevices }
