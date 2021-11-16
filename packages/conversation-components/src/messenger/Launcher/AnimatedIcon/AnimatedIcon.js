import PropTypes from 'prop-types'
import Transition from 'react-transition-group/Transition'
import { animatedDuration, Icon } from './styles'

const AnimatedIcon = ({ isVisible, hiddenPosition, children }) => {
  return (
    <Transition in={isVisible} timeout={animatedDuration * 1000}>
      {(state) => (
        <Icon state={state} hiddenPosition={hiddenPosition} aria-hidden={state === 'exited'}>
          {children}
        </Icon>
      )}
    </Transition>
  )
}

AnimatedIcon.propTypes = {
  isVisible: PropTypes.bool,
  hiddenPosition: PropTypes.string,
  children: PropTypes.node,
}

export default AnimatedIcon
