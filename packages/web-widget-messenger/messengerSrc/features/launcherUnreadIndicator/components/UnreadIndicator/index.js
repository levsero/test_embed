import PropTypes from 'prop-types'
import { useDispatch } from 'react-redux'
import { unreadIndicatorSize } from 'messengerSrc/constants'
import { widgetToggled } from 'messengerSrc/store/visibility'
import { Container, Plus } from './styles'

const max = 99

const UnreadIndicator = ({ unreadCount = 0 }) => {
  const dispatch = useDispatch()
  const countToDisplay = Math.min(unreadCount, max)

  return (
    <div
      onClick={() => {
        dispatch(widgetToggled())
      }}
      aria-hidden="true"
      style={{ cursor: 'pointer', width: unreadIndicatorSize + 20, display: 'flex' }}
    >
      <Container>
        {countToDisplay}
        {unreadCount > max && <Plus>+</Plus>}
      </Container>
    </div>
  )
}

UnreadIndicator.propTypes = { unreadCount: PropTypes.number }

export default UnreadIndicator
