import React from 'react'
import PropTypes from 'prop-types'
import Transition from 'react-transition-group/Transition'
import {
  animatedDuration,
  Icon
} from 'src/apps/messenger/features/launcher/components/SquareLauncher/LauncherIcon/styles'
import { useSelector } from 'react-redux'
import {
  getIsFullScreen,
  getIsVerticallySmallScreen
} from 'src/apps/messenger/features/responsiveDesign/store'

const AnimatedIcon = ({ isVisible, hiddenPosition, children }) => {
  const isVerticallySmallScreen = useSelector(getIsVerticallySmallScreen)
  const isFullScreen = useSelector(getIsFullScreen)

  const shouldAnimate = !isVerticallySmallScreen && !isFullScreen

  return (
    <Transition in={isVisible} timeout={shouldAnimate ? animatedDuration * 1000 : 0}>
      {state => (
        <Icon
          state={state}
          hiddenPosition={hiddenPosition}
          shouldAnimate={shouldAnimate}
          aria-hidden={state === 'exited'}
        >
          {children}
        </Icon>
      )}
    </Transition>
  )
}

AnimatedIcon.propTypes = {
  isVisible: PropTypes.bool,
  hiddenPosition: PropTypes.string,
  children: PropTypes.node
}

export default AnimatedIcon
