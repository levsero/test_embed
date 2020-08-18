const defaultStyles = {
  position: 'fixed',
  height: 500,
  width: 300,
  minWidth: 300,
  maxHeight: 'calc(100vh - 90px - 10px)',
  right: 0,
  bottom: 90
}

const verticallySmallStyles = {
  height: '100%',
  maxHeight: 'none',
  top: 0
}

const noLauncherStyles = {
  bottom: 0
}

const fullscreenStyles = {
  width: '100%',
  top: 0,
  bottom: 0,
  left: 0,
  right: 0
}

const getFrameStyles = ({ isFullScreen, isVerticallySmallScreen, isLauncherVisible }) => {
  return Object.assign(
    {},
    defaultStyles,
    isVerticallySmallScreen && verticallySmallStyles,
    !isLauncherVisible && noLauncherStyles,
    isFullScreen && fullscreenStyles
  )
}

export { getFrameStyles }
