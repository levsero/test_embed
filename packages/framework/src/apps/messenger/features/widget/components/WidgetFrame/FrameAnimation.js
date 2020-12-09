import React from 'react'
import PropTypes from 'prop-types'
import { Transition } from 'react-transition-group'
import {
  getFrameStyles,
  getFrameWrapperStyles,
  openAnimationDuration
} from 'src/apps/messenger/features/widget/components/WidgetFrame/styles'
import { useSelector } from 'react-redux'
import {
  getIsFullScreen,
  getIsVerticallySmallScreen
} from 'src/apps/messenger/features/responsiveDesign/store'
import { getIsLauncherVisible } from 'src/apps/messenger/features/launcher/store'
import { getPosition } from 'src/apps/messenger/features/themeProvider/store'
import { getIsWidgetOpen } from 'src/apps/messenger/store/visibility'

const FrameAnimation = ({ children }) => {
  const isLauncherVisible = useSelector(getIsLauncherVisible)
  const isVerticallySmallScreen = useSelector(getIsVerticallySmallScreen)
  const isFullScreen = useSelector(getIsFullScreen)
  const position = useSelector(getPosition)
  const isWidgetOpen = useSelector(getIsWidgetOpen)

  const shouldAnimate = !isFullScreen && !isVerticallySmallScreen

  return (
    <Transition in={isWidgetOpen} timeout={shouldAnimate ? openAnimationDuration * 1000 : 0}>
      {status => (
        <div
          style={getFrameWrapperStyles({
            isVerticallySmallScreen,
            isLauncherVisible,
            isFullScreen,
            position,
            isClosed: status === 'exiting' || status === 'exited'
          })}
        >
          {children(
            status,
            getFrameStyles({
              isVerticallySmallScreen,
              isFullScreen
            })
          )}
        </div>
      )}
    </Transition>
  )
}

FrameAnimation.propTypes = {
  children: PropTypes.func
}

export default FrameAnimation
