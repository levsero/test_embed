import PropTypes from 'prop-types'
import { MESSAGE_BUBBLE_SHAPES, MESSAGE_STATUS } from 'src/constants'
import { PrimaryParticipantBubble, OtherParticipantBubble } from './styles'

const MessageBubble = ({
  shape = 'standalone',
  status,
  children,
  isPrimaryParticipant = true,
  isFreshMessage = true,
  type,
}) => {
  const ParticipantBubble = isPrimaryParticipant ? PrimaryParticipantBubble : OtherParticipantBubble

  return (
    <ParticipantBubble
      shape={status === MESSAGE_STATUS.failed ? 'standalone' : shape}
      status={status}
      isFreshMessage={isFreshMessage}
      data-testid={'participant-bubble'}
      type={type}
    >
      {children}
    </ParticipantBubble>
  )
}

MessageBubble.propTypes = {
  shape: PropTypes.oneOf(Object.values(MESSAGE_BUBBLE_SHAPES)),
  status: PropTypes.oneOf(Object.values(MESSAGE_STATUS)),
  children: PropTypes.node,
  isPrimaryParticipant: PropTypes.bool,
  isFreshMessage: PropTypes.bool,
  type: PropTypes.string,
}

export default MessageBubble
