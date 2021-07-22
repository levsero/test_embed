import PropTypes from 'prop-types'
import useLabels from 'src/hooks/useLabels'
import { CloseIcon, HeaderControl, IconButton } from 'src/messenger/MessengerHeader/styles'

const Close = ({ onClick }) => {
  const labels = useLabels().messengerHeader

  return (
    <HeaderControl>
      <IconButton onClick={onClick} aria-label={labels.closeButtonAriaLabel}>
        <CloseIcon />
      </IconButton>
    </HeaderControl>
  )
}

Close.propTypes = {
  onClick: PropTypes.func,
}

export default Close
