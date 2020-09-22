import React from 'react'
import PropTypes from 'prop-types'
import MessageBubble from 'src/apps/messenger/features/sunco-components/MessageBubble'

import { OtherParticipantImage, PrimaryParticipantImage, Text } from './styles'

const ImageMessage = ({ isPrimaryParticipant, mediaUrl, text, shape }) => {
  const ParticipantImage = isPrimaryParticipant ? PrimaryParticipantImage : OtherParticipantImage
  const hasText = text && text.trim().length > 0

  return (
    <MessageBubble shape={shape} isPrimaryParticipant={isPrimaryParticipant}>
      <ParticipantImage
        src={mediaUrl}
        alt={mediaUrl}
        shape={shape}
        isPrimaryParticipant={isPrimaryParticipant}
        hasText={hasText}
      />
      {hasText && <Text>{text}</Text>}
    </MessageBubble>
  )
}

ImageMessage.propTypes = {
  isPrimaryParticipant: PropTypes.bool,
  text: PropTypes.string,
  mediaUrl: PropTypes.string,
  shape: PropTypes.oneOf(['standalone', 'first', 'middle', 'last'])
}

export default ImageMessage
