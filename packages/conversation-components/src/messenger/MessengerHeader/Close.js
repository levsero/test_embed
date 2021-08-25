import PropTypes from 'prop-types'
import IconButton from 'src/IconButton'
import useLabels from 'src/hooks/useLabels'
import { CloseIcon, HeaderControl } from 'src/messenger/MessengerHeader/styles'

const Close = ({ onClick }) => {
  const labels = useLabels().messengerHeader

  return (
    <HeaderControl>
      <IconButton
        backgroundColor={'primary'}
        highlightColor={'primaryText'}
        buttonSize={'xl'}
        iconSize={'md'}
        onClick={onClick}
        aria-label={labels.closeButtonAriaLabel}
      >
        <CloseIcon />
      </IconButton>
    </HeaderControl>
  )
}

Close.propTypes = {
  onClick: PropTypes.func,
}

export default Close
