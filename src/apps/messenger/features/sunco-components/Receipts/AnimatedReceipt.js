import React, { useEffect, useRef } from 'react'
import PropTypes from 'prop-types'
import { rem } from 'polished'
import Animated from 'src/apps/messenger/features/sunco-components/Animated'
import styled from 'styled-components'
import { disabledAnimationsCSS } from 'src/apps/messenger/features/sunco-components/Animated/useDisableAnimationProps'
import messageSteps from 'src/apps/messenger/features/sunco-components/Animated/messageSteps'
import { baseFontSize } from 'src/apps/messenger/constants'

const enterAnimations = {
  ...messageSteps.receiptEnter,
  from: rem(20, baseFontSize),
  to: rem(20, baseFontSize)
}

const reappearAnimations = {
  ...messageSteps.receiptReenter,
  from: 0,
  to: rem(20, baseFontSize)
}

const StyledAnimated = styled(Animated)`
  max-height: 0;
  overflow: hidden;

  ${Animated.beforeEnter} {
    max-height: ${props => props.enter.from};
  }

  ${Animated.entering} {
    max-height: ${props => props.enter.to};
  }

  ${Animated.entered} {
    max-height: none;
  }

  ${Animated.beforeExit} {
    max-height: none;
  }

  ${Animated.exiting} {
    overflow: visible;
    max-height: 0;
  }

  ${Animated.exited} {
    max-height: 0;
  }

  ${props =>
    props.isVisible &&
    `
    transition: max-height ${props.enter.duration}s ${props.enter.delay}s;
  `}

  ${props =>
    !props.isVisible &&
    `
    transition: max-height ${props.exit.duration}s ${props.exit.delay}s;
  `}

  ${disabledAnimationsCSS}
`

const AnimatedReceipt = ({ isReceiptVisible, isFreshMessage, children }) => {
  const hasRendered = useRef(false)

  useEffect(() => {
    hasRendered.current = true
  }, [])

  return (
    <StyledAnimated
      isVisible={isReceiptVisible}
      isFreshMessage={isFreshMessage}
      name="receipt"
      enter={!isFreshMessage || hasRendered.current ? reappearAnimations : enterAnimations}
      exit={messageSteps.receiptExit}
    >
      {children}
    </StyledAnimated>
  )
}

AnimatedReceipt.propTypes = {
  isReceiptVisible: PropTypes.bool,
  isFreshMessage: PropTypes.bool,
  children: PropTypes.node
}

export default AnimatedReceipt
