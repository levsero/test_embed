import PropTypes from 'prop-types'
import { createContext } from 'react'
import { useSelector } from 'react-redux'
import { Transition } from 'react-transition-group'
import { getIsLauncherVisible } from 'messengerSrc/features/launcher/store'
import {
  getIsFullScreen,
  getIsVerticallySmallScreen,
} from 'messengerSrc/features/responsiveDesign/store'
import { getPosition } from 'messengerSrc/features/themeProvider/store'
import { getZIndex } from 'messengerSrc/features/themeProvider/store'
import {
  getFrameStyles,
  getFrameWrapperStyles,
  openAnimationDuration,
} from 'messengerSrc/features/widget/components/WidgetFrame/styles'
import { getIsWidgetOpen } from 'messengerSrc/store/visibility'

export const AnimationContext = createContext('loadingAnimation')

const FrameAnimation = ({ children }) => {
  const isLauncherVisible = useSelector(getIsLauncherVisible)
  const isVerticallySmallScreen = useSelector(getIsVerticallySmallScreen)
  const isFullScreen = useSelector(getIsFullScreen)
  const position = useSelector(getPosition)
  const isWidgetOpen = useSelector(getIsWidgetOpen)
  const zIndex = useSelector(getZIndex)
  const dontAnimate = isFullScreen || isVerticallySmallScreen

  return (
    <Transition in={isWidgetOpen} timeout={dontAnimate ? 0 : openAnimationDuration * 1000}>
      {(status) => (
        <div
          style={getFrameWrapperStyles({
            isVerticallySmallScreen,
            isLauncherVisible,
            isFullScreen,
            position,
            isClosed: status === 'exiting' || status === 'exited',
            zIndex,
          })}
        >
          <AnimationContext.Provider value={status === 'entered'}>
            {children(
              status,
              getFrameStyles({
                isVerticallySmallScreen,
                isFullScreen,
              })
            )}
          </AnimationContext.Provider>
        </div>
      )}
    </Transition>
  )
}

FrameAnimation.propTypes = {
  children: PropTypes.func,
}

export default FrameAnimation
