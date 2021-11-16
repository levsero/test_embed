import PropTypes from 'prop-types'
import AnimatedIcon from '../AnimatedIcon/AnimatedIcon'
import { CloseIcon, MessengerIcon } from './styles'

const LauncherIcon = ({ isOpen, position }) => {
  return (
    <>
      <AnimatedIcon isVisible={!isOpen} hiddenPosition="-100%">
        <MessengerIcon position={position} />
      </AnimatedIcon>
      <AnimatedIcon isVisible={isOpen} hiddenPosition="100%">
        <CloseIcon />
      </AnimatedIcon>
    </>
  )
}

LauncherIcon.propTypes = {
  isOpen: PropTypes.bool,
  position: PropTypes.oneOf(['left', 'right']),
}

export default LauncherIcon
