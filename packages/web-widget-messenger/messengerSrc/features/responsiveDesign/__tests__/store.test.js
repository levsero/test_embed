import createStore from 'messengerSrc/store'
import { mockMatchMedia } from 'messengerSrc/utils/testHelpers'
import {
  breakpoints,
  getIsFullScreen,
  getIsVerticallySmallScreen,
  watchForScreenChanges,
} from '../store'

describe('response design store', () => {
  it('is vertically small when the screen is smaller than 400px', () => {
    const { triggerChangeForBreakpoint } = mockMatchMedia()

    const store = createStore()
    store.dispatch(watchForScreenChanges())

    triggerChangeForBreakpoint(breakpoints.isVerticallySmallScreen, { matches: true })

    expect(getIsVerticallySmallScreen(store.getState())).toBe(true)
  })

  it('is not vertically small when the screen is larger than 400px', () => {
    const { triggerChangeForBreakpoint } = mockMatchMedia()

    const store = createStore()
    store.dispatch(watchForScreenChanges())

    triggerChangeForBreakpoint(breakpoints.isVerticallySmallScreen, { matches: false })

    expect(getIsVerticallySmallScreen(store.getState())).toBe(false)
  })

  it('is full screen when the screen is vertically and horizontally small', () => {
    const { triggerChangeForBreakpoint } = mockMatchMedia()

    const store = createStore()
    store.dispatch(watchForScreenChanges())

    triggerChangeForBreakpoint(breakpoints.isFullScreen, { matches: false })

    expect(getIsFullScreen(store.getState())).toBe(false)

    triggerChangeForBreakpoint(breakpoints.isFullScreen, { matches: true })

    expect(getIsFullScreen(store.getState())).toBe(true)
  })
})
