import React from 'react'
import PropTypes from 'prop-types'
import Linkify from 'react-linkify'

import { MESSAGE_BUBBLE_SHAPES } from 'src/apps/messenger/features/sunco-components/constants'
import MessageBubble from 'src/apps/messenger/features/sunco-components/MessageBubble'
import { OtherParticipantImage, PrimaryParticipantImage, Text } from './styles'

const ImageMessage = ({ isPrimaryParticipant, mediaUrl, text, shape }) => {
  const ParticipantImage = isPrimaryParticipant ? PrimaryParticipantImage : OtherParticipantImage
  const hasText = text && text.trim().length > 0

  return (
    <MessageBubble shape={shape} isPrimaryParticipant={isPrimaryParticipant}>
      <a href={mediaUrl} target="_blank">
        <ParticipantImage
          src={mediaUrl}
          alt={mediaUrl}
          shape={shape}
          isPrimaryParticipant={isPrimaryParticipant}
          hasText={hasText}
        />
      </a>
      {hasText && (
        <Linkify properties={{ target: '_blank' }}>
          <Text isPrimaryParticipant={isPrimaryParticipant}>{text}</Text>
        </Linkify>
      )}
    </MessageBubble>
  )
}

ImageMessage.propTypes = {
  isPrimaryParticipant: PropTypes.bool,
  text: PropTypes.string,
  mediaUrl: PropTypes.string,
  shape: PropTypes.oneOf(Object.values(MESSAGE_BUBBLE_SHAPES))
}

export default ImageMessage
