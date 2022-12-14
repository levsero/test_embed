import PropTypes from 'prop-types'
import { MESSAGE_BUBBLE_SHAPES, MESSAGE_STATUS, MESSAGE_TYPES } from 'src/constants'
import { PrimaryParticipantBubble, OtherParticipantBubble } from './styles'

const MessageBubble = ({
  shape = 'standalone',
  status,
  children,
  isPrimaryParticipant = true,
  isFreshMessage = true,
  type,
  className,
}) => {
  const ParticipantBubble = isPrimaryParticipant ? PrimaryParticipantBubble : OtherParticipantBubble

  return (
    <ParticipantBubble
      shape={status === MESSAGE_STATUS.failed ? 'standalone' : shape}
      status={status}
      isFreshMessage={isFreshMessage}
      data-testid={'participant-bubble'}
      type={type}
      className={className}
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
  type: PropTypes.oneOf(Object.values(MESSAGE_TYPES)),
  className: PropTypes.string,
}

export default MessageBubble
