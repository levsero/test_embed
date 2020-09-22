import React from 'react'
import PropTypes from 'prop-types'
import ImageMessage from 'src/apps/messenger/features/sunco-components/ImageMessage'
import PrimaryParticipantLayout from 'src/apps/messenger/features/sunco-components/Layouts/PrimaryParticipantLayout'
import OtherParticipantLayout from 'src/apps/messenger/features/sunco-components/Layouts/OtherParticipantLayout'

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
  const Layout = isPrimaryParticipant ? PrimaryParticipantLayout : OtherParticipantLayout
  return (
    <Layout
      isFirstInGroup={isFirstInGroup}
      avatar={isLastInGroup ? avatarUrl : undefined}
      label={isFirstInGroup ? name : undefined}
    >
      <ImageMessage
        isPrimaryParticipant={isPrimaryParticipant}
        shape={messageShape(isFirstInGroup, isLastInGroup)}
        mediaUrl={mediaUrl}
        text={text}
      />
    </Layout>
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
