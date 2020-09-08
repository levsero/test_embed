import { rem } from 'polished'
import { baseFontSize } from 'src/apps/messenger/features/themeProvider'
import {
  frameBoxShadow,
  frameMarginFromPage,
  launcherSize,
  marginBetweenFrames,
  widgetFrameHeight,
  widgetFrameWidth
} from 'src/apps/messenger/constants'

const defaultStyles = {
  position: 'fixed',
  height: rem(widgetFrameHeight, baseFontSize),
  width: rem(widgetFrameWidth, baseFontSize),
  minWidth: rem(widgetFrameWidth, baseFontSize),
  maxHeight: `calc(100vh - ${launcherSize +
    frameMarginFromPage +
    frameMarginFromPage +
    marginBetweenFrames}px)`,
  maxWidth: '100%',
  bottom: launcherSize + frameMarginFromPage + marginBetweenFrames,
  border: 0,
  boxShadow: frameBoxShadow
}

const verticallySmallStyles = {
  maxHeight: `calc(100vh - ${frameMarginFromPage * 2}px)`
}

const noLauncherStyles = {
  bottom: frameMarginFromPage
}

const fullscreenStyles = {
  width: '100%',
  top: 0,
  bottom: 0,
  left: 0,
  right: 0,
  minWidth: 'auto',
  maxHeight: 'none',
  height: '100%',
  boxShadow: 'none'
}

const getFrameStyles = ({ isFullScreen, isVerticallySmallScreen, isLauncherVisible, position }) => {
  return Object.assign(
    { [position]: frameMarginFromPage },
    defaultStyles,
    isVerticallySmallScreen && verticallySmallStyles,
    !isLauncherVisible && noLauncherStyles,
    isFullScreen && fullscreenStyles
  )
}

export { getFrameStyles }
