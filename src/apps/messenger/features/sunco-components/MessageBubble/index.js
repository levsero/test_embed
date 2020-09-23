import React from 'react'
import PropTypes from 'prop-types'

import { MESSAGE_BUBBLE_SHAPES } from 'src/apps/messenger/features/sunco-components/constants'
import { PrimaryParticipantBubble, OtherParticipantBubble } from './styles'

const MessageBubble = ({ isPrimaryParticipant, shape, children }) => {
  const ParticipantBubble = isPrimaryParticipant ? PrimaryParticipantBubble : OtherParticipantBubble

  return <ParticipantBubble shape={shape}>{children}</ParticipantBubble>
}

MessageBubble.propTypes = {
  isPrimaryParticipant: PropTypes.bool,
  children: PropTypes.node,
  shape: PropTypes.oneOf(Object.values(MESSAGE_BUBBLE_SHAPES))
}

export default MessageBubble
