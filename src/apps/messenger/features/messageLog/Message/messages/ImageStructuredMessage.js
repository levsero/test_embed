import React from 'react'
import PropTypes from 'prop-types'

import PrimaryParticipantLayout from 'src/apps/messenger/features/sunco-components/Layouts/PrimaryParticipantLayout'
import OtherParticipantLayout from 'src/apps/messenger/features/sunco-components/Layouts/OtherParticipantLayout'
import ImageMessage from 'src/apps/messenger/features/sunco-components/ImageMessage'
import getMessageShape from 'src/apps/messenger/features/messageLog/utils/getMessageShape'

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
        shape={getMessageShape(isFirstInGroup, isLastInGroup)}
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
