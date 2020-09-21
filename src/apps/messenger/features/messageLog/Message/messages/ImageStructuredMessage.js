import React from 'react'
import PropTypes from 'prop-types'
import ImageMessage from 'src/apps/messenger/features/sunco-components/ImageMessage'

const messageShape = (isFirstInGroup, isLastInGroup) => {
  if (isFirstInGroup && isLastInGroup) return 'standalone'
  if (isFirstInGroup) return 'first'
  if (!isFirstInGroup && !isLastInGroup) return 'middle'
  if (isLastInGroup) return 'last'
}

const ImageStructuredMessage = ({
  message: { role, text, mediaUrl, isFirstInGroup, isLastInGroup, avatarUrl, name }
}) => {
  const isPrimaryParticipant = role === 'appUser'
  return (
    <ImageMessage
      isFirstInGroup={isFirstInGroup}
      shape={messageShape(isFirstInGroup, isLastInGroup)}
      mediaUrl={mediaUrl}
      text={text}
      isPrimaryParticipant={isPrimaryParticipant}
      avatar={isLastInGroup ? avatarUrl : undefined}
      label={isFirstInGroup ? name : undefined}
    />
  )
}

ImageStructuredMessage.propTypes = {
  message: PropTypes.shape({
    role: PropTypes.string,
    text: PropTypes.string,
    mediaUrl: PropTypes.string,
    avatarUrl: PropTypes.string,
    isFirstInGroup: PropTypes.bool,
    isLastInGroup: PropTypes.bool
  })
}

export default ImageStructuredMessage
