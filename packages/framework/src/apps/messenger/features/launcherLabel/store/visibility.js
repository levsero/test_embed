import { createAction, createSlice } from '@reduxjs/toolkit'
import { store as persistence } from 'src/framework/services/persistence'
import { getIsWidgetOpen } from 'src/apps/messenger/store/visibility'
import { getIsFullScreen } from 'src/apps/messenger/features/responsiveDesign/store'
import { getIsVisibleOnSmallDevices, getLauncherLabelText } from './config'

export const launcherLabelStorageKey = 'launcherLabelRemoved'

const initialiseLauncherLabel = createAction('initialiseLauncherLabel', () => ({
  payload: {
    hasBeenClosed: Boolean(persistence.get(launcherLabelStorageKey))
  }
}))

const launcherLabelVisibility = createSlice({
  name: 'launcherLabelVisibility',
  initialState: {
    hasBeenClosed: false
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
    }
  }
})

const { labelHidden } = launcherLabelVisibility.actions

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

  if (!getLauncherLabelText(state)) {
    return false
  }

  return !state.launcherLabel.visibility.hasBeenClosed
}

export default launcherLabelVisibility.reducer
export { labelHidden, initialiseLauncherLabel, getIsLauncherLabelVisible }
