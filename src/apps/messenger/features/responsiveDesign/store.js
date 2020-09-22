import { createSlice } from '@reduxjs/toolkit'
import hostPageWindow from 'src/framework/utils/hostPageWindow'
import { rem } from 'polished'
import { baseFontSize } from 'src/apps/messenger/features/themeProvider'

const fullScreenHeightBreakpoint = rem('825px', `${baseFontSize}px`)
const fullScreenWidthBreakpoint = rem('415px', `${baseFontSize}px`)
const verticallySmallBreakpoint = rem('670px', `${baseFontSize}px`)

const breakpoints = {
  isVerticallySmallScreen: `(max-height: ${verticallySmallBreakpoint})`,
  isFullScreen: `
    (orientation: portrait) and (max-height: ${fullScreenHeightBreakpoint}) and (max-width: ${fullScreenWidthBreakpoint}),
    (orientation: landscape) and (max-height: ${fullScreenWidthBreakpoint}) and (max-width: ${fullScreenHeightBreakpoint}),
  `
}
const slice = createSlice({
  name: 'responsiveDesign',
  initialState: {
    isVerticallySmallScreen: hostPageWindow.matchMedia(breakpoints.isVerticallySmallScreen).matches,
    isFullScreen: hostPageWindow.matchMedia(breakpoints.isFullScreen).matches
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
  const verticalMatchMedia = hostPageWindow.matchMedia(breakpoints.isVerticallySmallScreen)
  const fullscreenMatchMedia = hostPageWindow.matchMedia(breakpoints.isFullScreen)

  const onVerticalChange = event => {
    dispatch(screenDimensionsChanged({ isVerticallySmallScreen: event.matches }))
  }

  const onFullscreenChange = event => {
    dispatch(screenDimensionsChanged({ isFullScreen: event.matches }))
  }

  if (verticalMatchMedia.addEventListener) {
    // For browsers that support modern matchMedia syntax
    verticalMatchMedia.addEventListener('change', onVerticalChange)
    fullscreenMatchMedia.addEventListener('change', onFullscreenChange)
  } else if (verticalMatchMedia.addListener) {
    // For browsers that only support deprecated matchMedia syntax
    verticalMatchMedia.addListener(onVerticalChange)
    fullscreenMatchMedia.addListener(onFullscreenChange)
  }
}

// Selectors
const getIsVerticallySmallScreen = state => state.responsiveDesign.isVerticallySmallScreen
const getIsFullScreen = state => state.responsiveDesign.isFullScreen

export {
  watchForScreenChanges,
  getIsVerticallySmallScreen,
  getIsFullScreen,
  breakpoints,
  screenDimensionsChanged
}
export default slice.reducer
