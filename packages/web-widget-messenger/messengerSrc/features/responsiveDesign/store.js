import { createSlice } from '@reduxjs/toolkit'
import { rem } from 'polished'
import { win } from '@zendesk/widget-shared-services'
import { baseFontSize } from 'messengerSrc/constants'

const fullScreenHeightBreakpoint = rem('926px', `${baseFontSize}px`)
const fullScreenWidthBreakpoint = rem('540px', `${baseFontSize}px`)
const verticallySmallBreakpoint = rem('670px', `${baseFontSize}px`)

const breakpoints = {
  isVerticallySmallScreen: `(max-height: ${verticallySmallBreakpoint})`,
  isFullScreen: `
    (orientation: portrait) and (max-height: ${fullScreenHeightBreakpoint}) and (max-width: ${fullScreenWidthBreakpoint}),
    (orientation: landscape) and (max-height: ${fullScreenWidthBreakpoint}) and (max-width: ${fullScreenHeightBreakpoint}),
  `,
}
const slice = createSlice({
  name: 'responsiveDesign',
  initialState: {
    isVerticallySmallScreen: win.matchMedia(breakpoints.isVerticallySmallScreen).matches,
    isFullScreen: win.matchMedia(breakpoints.isFullScreen).matches,
  },
  reducers: {
    screenDimensionsChanged(state, action) {
      return {
        ...state,
        ...action.payload,
      }
    },
  },
})

// Actions
const { screenDimensionsChanged } = slice.actions
const watchForScreenChanges = () => (dispatch) => {
  const verticalMatchMedia = win.matchMedia(breakpoints.isVerticallySmallScreen)
  const fullscreenMatchMedia = win.matchMedia(breakpoints.isFullScreen)

  const onVerticalChange = (event) => {
    dispatch(screenDimensionsChanged({ isVerticallySmallScreen: event.matches }))
  }

  const onFullscreenChange = (event) => {
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
const getIsVerticallySmallScreen = (state) => state.responsiveDesign.isVerticallySmallScreen
const getIsFullScreen = (state) => state.responsiveDesign.isFullScreen

export {
  watchForScreenChanges,
  getIsVerticallySmallScreen,
  getIsFullScreen,
  breakpoints,
  screenDimensionsChanged,
}
export default slice.reducer
