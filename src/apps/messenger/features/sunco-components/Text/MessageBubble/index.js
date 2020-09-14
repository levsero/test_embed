import React from 'react'
import PropTypes from 'prop-types'

import { PrimaryParticipantBubble, OtherParticipantBubble } from './styles'

const MessageBubble = ({ appUser, children, isFirstInGroup, isLastInGroup }) => {
  const ChosenBubble = appUser ? PrimaryParticipantBubble : OtherParticipantBubble

  const isStandalone = isFirstInGroup && isLastInGroup

  const first = !isStandalone && isFirstInGroup
  const middle = !isStandalone && !isFirstInGroup && !isLastInGroup
  const last = !isStandalone && isLastInGroup

  return (
    <ChosenBubble isStandalone={isStandalone} last={last} first={first} middle={middle}>
      {children}
    </ChosenBubble>
  )
}

MessageBubble.propTypes = {
  appUser: PropTypes.bool,
  children: PropTypes.node,
  isFirstInGroup: PropTypes.bool,
  isLastInGroup: PropTypes.bool
}

export default MessageBubble
