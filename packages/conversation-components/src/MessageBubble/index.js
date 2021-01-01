import PropTypes from 'prop-types'

import { MESSAGE_BUBBLE_SHAPES, MESSAGE_STATUS } from 'src/constants'
import { PrimaryParticipantBubble, OtherParticipantBubble } from './styles'

const MessageBubble = ({
  shape = 'standalone',
  status = 'sent',
  children,
  isPrimaryParticipant = true,
  isFreshMessage = true
}) => {
  const ParticipantBubble = isPrimaryParticipant ? PrimaryParticipantBubble : OtherParticipantBubble

  return (
    <ParticipantBubble shape={shape} status={status} isFreshMessage={isFreshMessage}>
      {children}
    </ParticipantBubble>
  )
}

MessageBubble.propTypes = {
  shape: PropTypes.oneOf(Object.values(MESSAGE_BUBBLE_SHAPES)),
  status: PropTypes.oneOf(Object.values(MESSAGE_STATUS)),
  children: PropTypes.node,
  isPrimaryParticipant: PropTypes.bool,
  isFreshMessage: PropTypes.bool
}

export default MessageBubble
