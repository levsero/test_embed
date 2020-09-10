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
  hostPageWindow
    .matchMedia(breakpoints.isVerticallySmallScreen)
    .addEventListener('change', event => {
      dispatch(screenDimensionsChanged({ isVerticallySmallScreen: event.matches }))
    })

  hostPageWindow.matchMedia(breakpoints.isFullScreen).addEventListener('change', event => {
    dispatch(screenDimensionsChanged({ isFullScreen: event.matches }))
  })
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
