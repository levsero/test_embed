import React from 'react'
import PropTypes from 'prop-types'
import { ImageMessage } from '@zendesk/conversation-components'

import getMessageShape from 'src/apps/messenger/features/messageLog/utils/getMessageShape'

const ImageStructuredMessage = ({
  message: {
    role,
    text,
    mediaUrl,
    isFirstInGroup,
    isLastInGroup,
    isFirstMessageInAuthorGroup,
    isLastMessageInAuthorGroup,
    avatarUrl,
    name,
    received,
    isLastMessageThatHasntFailed
  }
}) => {
  const isPrimaryParticipant = role === 'appUser'
  return (
    <ImageMessage
      isPrimaryParticipant={isPrimaryParticipant}
      isFirstInGroup={isFirstInGroup}
      avatar={isLastMessageInAuthorGroup ? avatarUrl : undefined}
      label={isFirstMessageInAuthorGroup ? name : undefined}
      isReceiptVisible={isLastMessageThatHasntFailed}
      timeReceived={received}
      shape={getMessageShape(isFirstInGroup, isLastInGroup)}
      mediaUrl={mediaUrl}
      text={text}
    />
  )
}

ImageStructuredMessage.propTypes = {
  message: PropTypes.shape({
    role: PropTypes.string,
    text: PropTypes.string,
    mediaUrl: PropTypes.string,
    isFirstInGroup: PropTypes.bool,
    isLastMessageThatHasntFailed: PropTypes.bool,
    isLastInLog: PropTypes.bool,
    avatarUrl: PropTypes.string,
    name: PropTypes.string
  })
}

export default ImageStructuredMessage
