import React from 'react'
import PropTypes from 'prop-types'
import Animated from 'src/apps/messenger/features/sunco-components/Animated'
import styled from 'styled-components'
import { disabledAnimationsCSS } from 'src/apps/messenger/features/sunco-components/Animated/useDisableAnimationProps'

const StyledAnimated = styled(Animated)`
  overflow: hidden;

  ${props =>
    props.isVisible &&
    `
    transition: max-height ${props.enter.duration}s ${props.enter.delay}s, opacity 0.3s 0.3s;
  `}

  ${props =>
    !props.isVisible &&
    `
    transition: max-height ${props.exit.duration}s ${props.exit.delay}s;
    max-height: 0;
  `}

  ${Animated.beforeEnter}, ${Animated.entering} {
    max-height: 0;
    opacity: 0;
  }

  ${Animated.entered} {
    max-height: none;
    opacity: 1;
  }

  ${Animated.beforeExit} {
    max-height: none;
  }

  ${Animated.exiting}, ${Animated.exited} {
    max-height: 0;
  }

  ${disabledAnimationsCSS}
`

const AnimatedReplies = ({ isVisible, isFreshMessage, children }) => {
  return (
    <StyledAnimated
      isVisible={isVisible}
      isFreshMessage={isFreshMessage}
      name="animate-replies"
      style={{
        overflow: 'hidden'
      }}
      enter={
        isFreshMessage
          ? {
              delay: 0.7,
              duration: 0
            }
          : {
              duration: 0,
              delay: 0
            }
      }
      exit={{
        duration: 0,
        delay: 0
      }}
    >
      {children}
    </StyledAnimated>
  )
}

AnimatedReplies.propTypes = {
  isVisible: PropTypes.bool,
  isFreshMessage: PropTypes.bool,
  children: PropTypes.node
}

export default AnimatedReplies
