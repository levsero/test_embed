import { useEffect, useRef, useContext } from 'react'
import PropTypes from 'prop-types'
import { rem } from 'polished'
import styled, { ThemeContext } from 'styled-components'

import Animated from 'src/Animated'
import disabledAnimationsCSS from 'src/animations/disabledAnimationsCSS'
import messageSteps from 'src/animations/messageSteps'

const enterAnimations = (theme) => ({
  ...messageSteps.receiptEnter,
  from: rem(20, theme.messenger.baseFontSize),
  to: rem(20, theme.messenger.baseFontSize),
})

const reappearAnimations = (theme) => ({
  ...messageSteps.receiptReenter,
  from: 0,
  to: rem(20, theme.messenger.baseFontSize),
})

const StyledAnimated = styled(Animated)`
  max-height: 0;
  overflow: hidden;

  ${Animated.beforeEnter} {
    max-height: ${(props) => props.enter.from};
  }

  ${Animated.entering} {
    max-height: ${(props) => props.enter.to};
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

  ${(props) =>
    props.isVisible &&
    `
    transition: max-height ${props.enter.duration}s ${props.enter.delay}s;
  `}

  ${(props) =>
    !props.isVisible &&
    `
    transition: max-height ${props.exit.duration}s ${props.exit.delay}s;
  `}

  ${disabledAnimationsCSS}
`

const AnimatedReceipt = ({ isReceiptVisible, isFreshMessage, children }) => {
  const hasRendered = useRef(false)
  const theme = useContext(ThemeContext)

  useEffect(() => {
    hasRendered.current = true
  }, [])

  return (
    <StyledAnimated
      isVisible={isReceiptVisible}
      isFreshMessage={isFreshMessage}
      name="receipt"
      enter={
        !isFreshMessage || hasRendered.current ? reappearAnimations(theme) : enterAnimations(theme)
      }
      exit={messageSteps.receiptExit}
    >
      {children}
    </StyledAnimated>
  )
}

AnimatedReceipt.propTypes = {
  isReceiptVisible: PropTypes.bool,
  isFreshMessage: PropTypes.bool,
  children: PropTypes.node,
}

export default AnimatedReceipt
