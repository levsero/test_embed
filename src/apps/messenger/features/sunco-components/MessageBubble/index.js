import React from 'react'
import PropTypes from 'prop-types'

import { PrimaryParticipantBubble, OtherParticipantBubble } from './styles'

const MessageBubble = ({ isPrimaryParticipant, shape, children }) => {
  const ParticipantBubble = isPrimaryParticipant ? PrimaryParticipantBubble : OtherParticipantBubble

  return <ParticipantBubble shape={shape}>{children}</ParticipantBubble>
}

MessageBubble.propTypes = {
  isPrimaryParticipant: PropTypes.bool,
  children: PropTypes.node,
  shape: PropTypes.oneOf(['standalone', 'first', 'middle', 'last'])
}

export default MessageBubble
