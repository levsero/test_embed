import PropTypes from 'prop-types'
import { CloseIcon, HeaderControl, IconButton } from 'src/messenger/MessengerHeader/styles'
import useLabels from 'src/hooks/useLabels'

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
