import { createAction, createSlice } from '@reduxjs/toolkit'
import { messengerConfigReceived } from 'src/apps/messenger/store/actions'
import { getIsFullScreen } from 'src/apps/messenger/features/responsiveDesign/store'
import { getIsWidgetOpen } from 'src/apps/messenger/store/visibility'
import { store as persistence } from 'src/framework/services/persistence'

export const launcherLabelStorageKey = 'launcherLabelRemoved'

const initialiseLauncherLabel = createAction('initialiseLauncherLabel', () => ({
  payload: {
    hasBeenClosed: Boolean(persistence.get(launcherLabelStorageKey))
  }
}))

const launcherLabel = createSlice({
  name: 'launcherLabel',
  initialState: {
    text: '',
    isVisibleOnMobile: false,
    hasBeenClosed: true
  },
  reducers: {
    labelHidden(state) {
      state.hasBeenClosed = true

      try {
        persistence.set(launcherLabelStorageKey, true)
      } catch {}
    }
  },
  extraReducers: {
    [initialiseLauncherLabel](state, action) {
      state.hasBeenClosed = Boolean(action.payload.hasBeenClosed)
    },
    [messengerConfigReceived](state, action) {
      if (action.payload?.launcher) {
        if (typeof action.payload.launcher.text === 'string') {
          state.text = action.payload.launcher.text.trim()
        }

        state.isVisibleOnMobile = Boolean(action.payload.launcher.showTextInMobile)
      }
    }
  }
})

const getLauncherLabelText = state => state.launcherLabel.text
const getIsVisibleOnSmallDevices = state => state.launcherLabel.isVisibleOnMobile

const getIsLauncherLabelVisible = state => {
  const isWidgetOpen = getIsWidgetOpen(state)

  if (isWidgetOpen) {
    return false
  }

  const isFullScreen = getIsFullScreen(state)
  const isVisibleOnSmallDevices = getIsVisibleOnSmallDevices(state)

  if (isFullScreen && !isVisibleOnSmallDevices) {
    return false
  }

  if (!state.launcherLabel.text) {
    return false
  }

  return !state.launcherLabel.hasBeenClosed
}

const { labelHidden } = launcherLabel.actions

export default launcherLabel.reducer
export {
  getLauncherLabelText,
  getIsVisibleOnSmallDevices,
  labelHidden,
  getIsLauncherLabelVisible,
  initialiseLauncherLabel
}
