import PropTypes from 'prop-types'
import CSSTransition from 'react-transition-group/CSSTransition'

// TODO - fix this
// import { useScroll } from 'src/apps/messenger/features/messageLog/hooks/useScrollBehaviour'

const Animated = ({
  children,
  enter,
  exit,
  name = 'animate',
  isFreshMessage,
  isVisible,
  className,
  onEntering = () => {},
  onEntered = () => {}
}) => {
  //TODO - ensure this is replaced
  // const { scrollToBottomIfNeeded } = useScroll()

  return (
    <CSSTransition
      classNames={name}
      in={Boolean(isVisible)}
      appear={isFreshMessage}
      mountOnEnter={true}
      timeout={{
        appear: (enter.duration + enter.delay) * 1000,
        enter: (enter.duration + enter.delay) * 1000,
        exit: (exit.duration + exit.delay) * 1000
      }}
      onEntering={onEntering}
      onEntered={onEntered}
    >
      <div>
        <div className={className}>{children}</div>
      </div>
    </CSSTransition>
  )
}

Animated.beforeEnter = props => `
  .${props.name}-appear &,
  .${props.name}-enter &
`

Animated.entering = props => `
  .${props.name}-appear-active &,
  .${props.name}-enter-active &
`

Animated.entered = props => `
  .${props.name}-appear-done &,
  .${props.name}-enter-done &
`

Animated.beforeExit = props => `.${props.name}-exit &`

Animated.exiting = props => `.${props.name}-exit-active &`

Animated.exited = props => `.${props.name}-exit-done &`

Animated.propTypes = {
  children: PropTypes.node,
  enter: PropTypes.shape({
    duration: PropTypes.number,
    delay: PropTypes.number
  }),
  exit: PropTypes.shape({
    duration: PropTypes.number,
    delay: PropTypes.number
  }),
  name: PropTypes.string,
  isVisible: PropTypes.bool,
  isFreshMessage: PropTypes.bool,
  className: PropTypes.string,
  onEntering: PropTypes.func,
  onEntered: PropTypes.func
}

export default Animated
