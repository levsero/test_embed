import { createSlice } from '@reduxjs/toolkit'
import hostPageWindow from 'src/framework/utils/hostPageWindow'

const breakpoints = {
  verticallySmallScreen: '(max-height: 400px)',
  horizontallySmallScreen: '(max-width: 300px) '
}

const slice = createSlice({
  name: 'responsiveDesign',
  initialState: {
    isVerticallySmallScreen: hostPageWindow.matchMedia(breakpoints.verticallySmallScreen).matches,
    isHorizontallySmallScreen: hostPageWindow.matchMedia(breakpoints.horizontallySmallScreen)
      .matches
  },
  reducers: {
    screenDimensionsChanged(state, action) {
      return {
        ...state,
        ...action.payload
      }
    }
  }
})

// Actions
const { screenDimensionsChanged } = slice.actions
const watchForScreenChanges = () => dispatch => {
  hostPageWindow.matchMedia(breakpoints.verticallySmallScreen).addEventListener('change', event => {
    dispatch(screenDimensionsChanged({ isVerticallySmallScreen: event.matches }))
  })

  hostPageWindow
    .matchMedia(breakpoints.horizontallySmallScreen)
    .addEventListener('change', event => {
      dispatch(screenDimensionsChanged({ isHorizontallySmallScreen: event.matches }))
    })
}

// Selectors
const getIsVerticallySmallScreen = state => state.responsiveDesign.isVerticallySmallScreen
const getIsHorizontallySmallScreen = state => state.responsiveDesign.isHorizontallySmallScreen

const getIsFullScreen = state =>
  getIsVerticallySmallScreen(state) && getIsHorizontallySmallScreen(state)

export {
  watchForScreenChanges,
  getIsVerticallySmallScreen,
  getIsFullScreen,
  breakpoints,
  screenDimensionsChanged
}
export default slice.reducer
