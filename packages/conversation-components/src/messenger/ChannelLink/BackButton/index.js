import PropTypes from 'prop-types'
import ChevronIcon from '@zendeskgarden/svg-icons/src/16/chevron-left-stroke.svg'
import IconButton from 'src/IconButton'

const BackButton = ({ onClick, ariaLabel }) => {
  return (
    <IconButton buttonSize="xl" iconSize="md" onClick={onClick} aria-label={ariaLabel}>
      <ChevronIcon />
    </IconButton>
  )
}

BackButton.propTypes = {
  onClick: PropTypes.func,
  ariaLabel: PropTypes.string,
}

export default BackButton
