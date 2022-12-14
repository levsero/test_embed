import PropTypes from 'prop-types'
import CSSTransition from 'react-transition-group/CSSTransition'
import { FRAME_ANIMATION_DURATION_IN_MS } from 'src/constants'
import { useScroll } from 'src/hooks/useScrollBehaviour'
import { isSafari } from 'src/utils/hostPageWindow'

const Animated = ({
  children,
  enter,
  exit,
  name = 'animate',
  isFreshMessage,
  isVisible,
  className,
  unmountOnExit = false,
}) => {
  const { scrollToBottomIfNeeded } = useScroll()
  const onEnter = () => {
    // Safari scrolls the host page if called before the animation has finished, so delay until it's done
    isSafari
      ? setTimeout(scrollToBottomIfNeeded, FRAME_ANIMATION_DURATION_IN_MS * 1000)
      : scrollToBottomIfNeeded()
  }

  return (
    <CSSTransition
      classNames={name}
      in={Boolean(isVisible)}
      appear={isFreshMessage}
      mountOnEnter={true}
      unmountOnExit={unmountOnExit}
      timeout={{
        appear: (enter.duration + enter.delay) * 1000,
        enter: (enter.duration + enter.delay) * 1000,
        exit: (exit.duration + exit.delay) * 1000,
      }}
      onEntering={onEnter}
      onEntered={onEnter}
    >
      <div>
        <div className={className}>{children}</div>
      </div>
    </CSSTransition>
  )
}

Animated.beforeEnter = (props) => `
  .${props.name}-appear &,
  .${props.name}-enter &
`

Animated.entering = (props) => `
  .${props.name}-appear-active &,
  .${props.name}-enter-active &
`

Animated.entered = (props) => `
  .${props.name}-appear-done &,
  .${props.name}-enter-done &
`

Animated.beforeExit = (props) => `.${props.name}-exit &`

Animated.exiting = (props) => `.${props.name}-exit-active &`

Animated.exited = (props) => `.${props.name}-exit-done &`

Animated.propTypes = {
  children: PropTypes.node,
  enter: PropTypes.shape({
    duration: PropTypes.number,
    delay: PropTypes.number,
  }),
  exit: PropTypes.shape({
    duration: PropTypes.number,
    delay: PropTypes.number,
  }),
  name: PropTypes.string,
  isVisible: PropTypes.bool,
  isFreshMessage: PropTypes.bool,
  className: PropTypes.string,
  unmountOnExit: PropTypes.bool,
}

export default Animated
