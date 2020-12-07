import { em } from 'polished'
import {
  baseFontSize,
  frameBoxShadow,
  frameMarginFromPage,
  launcherSize,
  marginBetweenFrames,
  widgetFrameHeight,
  widgetFrameWidth,
  zIndex
} from 'src/apps/messenger/constants'

export const openAnimationDuration = 0.7

const maxHeightSmallScreens = `calc(100vh - ${frameMarginFromPage * 2}px)`

const defaultStyles = {
  zIndex,
  height: em(widgetFrameHeight, baseFontSize),
  width: em(widgetFrameWidth, baseFontSize),
  maxHeight: `calc(100vh - ${launcherSize +
    frameMarginFromPage +
    frameMarginFromPage +
    marginBetweenFrames}px)`,
  maxWidth: '100%',
  border: 0,
  overflow: 'hidden'
}

const openBezierCurve = 'cubic-bezier(0.76, 0, 0.16, 1)'
const closeBezierCurve = 'cubic-bezier(0.66, 0, 0.1, 1)'

const getFrameWrapperStyles = ({
  isFullScreen,
  isVerticallySmallScreen,
  isLauncherVisible,
  position,
  isClosed
}) => {
  const shouldAnimateHeight = !isVerticallySmallScreen && !isFullScreen

  let styles = {
    ...defaultStyles,
    position: 'fixed',
    [position]: frameMarginFromPage,
    bottom: launcherSize + frameMarginFromPage + marginBetweenFrames,
    overflow: 'visible',
    boxShadow: frameBoxShadow
  }

  if (shouldAnimateHeight) {
    styles.transition = `height ${openAnimationDuration}s 0.2s ${
      isClosed ? closeBezierCurve : openBezierCurve
    }`
    styles.overflow = 'hidden'
  }

  if (isVerticallySmallScreen) {
    styles.maxHeight = maxHeightSmallScreens
  }

  if (!isLauncherVisible) {
    styles.bottom = frameMarginFromPage
  }

  if (isFullScreen) {
    styles = {
      ...styles,
      width: '100%',
      top: 0,
      bottom: 0,
      left: 0,
      right: 0,
      minWidth: 'auto',
      maxHeight: 'none',
      height: '100%',
      transition: 'none'
    }
  }

  if (isClosed) {
    styles = { ...styles, height: 0 }
  }

  return styles
}

const getFrameStyles = ({ isFullScreen, isVerticallySmallScreen }) => {
  const styles = {
    ...defaultStyles,
    position: 'absolute',
    top: 0,
    bottom: 0,
    right: 0,
    left: 0
  }

  if (isVerticallySmallScreen) {
    styles.maxHeight = maxHeightSmallScreens
    styles.height = '100%'
  }

  if (isFullScreen) {
    styles.width = '100%'
    styles.height = '100%'
    styles.maxHeight = 'none'
  }

  return styles
}

export { getFrameWrapperStyles, getFrameStyles }
