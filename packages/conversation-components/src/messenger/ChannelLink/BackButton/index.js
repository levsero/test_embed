import PropTypes from 'prop-types'

import { IconButton } from '@zendeskgarden/react-buttons'
import ChevronIcon from '@zendeskgarden/svg-icons/src/16/chevron-left-stroke.svg'

const BackButton = ({ onClick = () => {}, ariaLabel }) => {
  return (
    <IconButton onClick={onClick} aria-label={ariaLabel}>
      <ChevronIcon />
    </IconButton>
  )
}

BackButton.propTypes = {
  onClick: PropTypes.func,
  ariaLabel: PropTypes.string,
}

export default BackButton
