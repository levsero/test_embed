import PropTypes from 'prop-types'
import { CloseIcon, CloseIconContainer, IconButton } from 'src/messenger/MessengerHeader/styles'
import useLabels from 'src/hooks/useLabels'

const Close = ({ onClick }) => {
  const labels = useLabels().messengerHeader

  return (
    <CloseIconContainer>
      <IconButton onClick={onClick} aria-label={labels.closeButtonAriaLabel}>
        <CloseIcon />
      </IconButton>
    </CloseIconContainer>
  )
}

Close.propTypes = {
  onClick: PropTypes.func,
}

export default Close
