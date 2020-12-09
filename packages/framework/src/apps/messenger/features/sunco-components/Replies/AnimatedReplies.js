import React from 'react'
import PropTypes from 'prop-types'
import Animated from 'src/apps/messenger/features/sunco-components/Animated'
import styled, { css } from 'styled-components'
import { disabledAnimationsCSS } from 'src/apps/messenger/features/sunco-components/Animated/useDisableAnimationProps'
import messageSteps, {
  transition
} from 'src/apps/messenger/features/sunco-components/Animated/messageSteps'

const StyledAnimated = styled(Animated)`
  overflow: hidden;

  transition: ${props => {
    if (props.isVisible) {
      const heightTransition = transition(
        props.isFreshMessage ? messageSteps.freshRepliesEnter : messageSteps.existingRepliesEnter,
        'max-height'
      )
      const opacityTransition = transition(messageSteps.repliesFadeIn, 'opacity')

      return css`
        ${heightTransition}, ${opacityTransition}
      `
    }

    return transition(messageSteps.repliesExit, 'max-height')
  }}};

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
      enter={isFreshMessage ? messageSteps.freshRepliesEnter : messageSteps.existingRepliesEnter}
      exit={messageSteps.repliesExit}
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
