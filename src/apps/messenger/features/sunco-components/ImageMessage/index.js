import React from 'react'
import PropTypes from 'prop-types'
import PrimaryParticipantLayout from 'src/apps/messenger/features/sunco-components/Layouts/PrimaryParticipantLayout'
import OtherParticipantLayout from 'src/apps/messenger/features/sunco-components/Layouts/OtherParticipantLayout'
import MessageBubble from './MessageBubble'

import { Image, Text, Padding } from './styles'

const ImageMessage = ({
  isPrimaryParticipant,
  mediaUrl,
  text,
  label,
  isFirstInGroup,
  shape,
  avatar
}) => {
  const Layout = isPrimaryParticipant ? PrimaryParticipantLayout : OtherParticipantLayout
  const hasText = text && text.trim().length > 0

  return (
    <Layout isFirstInGroup={isFirstInGroup} avatar={avatar} label={label}>
      <MessageBubble shape={shape} isPrimaryParticipant={isPrimaryParticipant}>
        <Image
          src={mediaUrl}
          alt={mediaUrl}
          shape={shape}
          isPrimaryParticipant={isPrimaryParticipant}
          hasText={hasText}
        />
        {hasText && (
          <Padding>
            <Text>{text}</Text>
          </Padding>
        )}
      </MessageBubble>
    </Layout>
  )
}

ImageMessage.propTypes = {
  isPrimaryParticipant: PropTypes.bool,
  text: PropTypes.string,
  mediaUrl: PropTypes.string,
  avatar: PropTypes.string,
  label: PropTypes.string,
  isFirstInGroup: PropTypes.bool,
  shape: PropTypes.oneOf(['standalone', 'first', 'middle', 'last'])
}

export default ImageMessage
