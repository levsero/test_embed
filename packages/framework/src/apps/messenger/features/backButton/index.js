import PropTypes from 'prop-types'

import { IconButton } from '@zendeskgarden/react-buttons'
import ChevronIcon from '@zendeskgarden/svg-icons/src/16/chevron-left-stroke.svg'

const BackButton = ({ onClick = () => {} }) => {
  return (
    <IconButton onClick={onClick}>
      <ChevronIcon />
    </IconButton>
  )
}

BackButton.propTypes = {
  onClick: PropTypes.func,
}

export default BackButton
