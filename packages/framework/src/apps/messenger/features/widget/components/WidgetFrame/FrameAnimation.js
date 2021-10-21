import PropTypes from 'prop-types'
import React, { useState } from 'react'
import { useSelector } from 'react-redux'
import { Transition } from 'react-transition-group'
import { getIsLauncherVisible } from 'src/apps/messenger/features/launcher/store'
import {
  getIsFullScreen,
  getIsVerticallySmallScreen,
} from 'src/apps/messenger/features/responsiveDesign/store'
import { getPosition } from 'src/apps/messenger/features/themeProvider/store'
import { getZIndex } from 'src/apps/messenger/features/themeProvider/store'
import {
  getFrameStyles,
  getFrameWrapperStyles,
  openAnimationDuration,
} from 'src/apps/messenger/features/widget/components/WidgetFrame/styles'
import { getIsWidgetOpen } from 'src/apps/messenger/store/visibility'

export const AnimationContext = React.createContext('loadingAnimation')

const FrameAnimation = ({ children }) => {
  const isLauncherVisible = useSelector(getIsLauncherVisible)
  const isVerticallySmallScreen = useSelector(getIsVerticallySmallScreen)
  const isFullScreen = useSelector(getIsFullScreen)
  const position = useSelector(getPosition)
  const isWidgetOpen = useSelector(getIsWidgetOpen)
  const zIndex = useSelector(getZIndex)
  const shouldAnimate = !isFullScreen && !isVerticallySmallScreen

  const [animationState, setAnimationState] = useState(!shouldAnimate)

  return (
    <Transition
      in={isWidgetOpen}
      timeout={shouldAnimate ? openAnimationDuration * 1000 : 0}
      onEntered={() => {
        setAnimationState(true)
      }}
      onExited={() => {
        setAnimationState(false)
      }}
    >
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
          <AnimationContext.Provider value={animationState}>
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
