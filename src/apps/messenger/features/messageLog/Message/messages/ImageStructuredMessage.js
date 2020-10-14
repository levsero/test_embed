import React from 'react'
import PropTypes from 'prop-types'

import PrimaryParticipantLayout from 'src/apps/messenger/features/sunco-components/Layouts/PrimaryParticipantLayout'
import OtherParticipantLayout from 'src/apps/messenger/features/sunco-components/Layouts/OtherParticipantLayout'
import ImageMessage from 'src/apps/messenger/features/sunco-components/ImageMessage'
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
  },
  scrollToBottomIfNeeded
}) => {
  const isPrimaryParticipant = role === 'appUser'
  const Layout = isPrimaryParticipant ? PrimaryParticipantLayout : OtherParticipantLayout
  return (
    <Layout
      isFirstInGroup={isFirstInGroup}
      avatar={isLastMessageInAuthorGroup ? avatarUrl : undefined}
      label={isFirstMessageInAuthorGroup ? name : undefined}
      isReceiptVisible={isLastMessageThatHasntFailed}
      timeReceived={received}
    >
      <ImageMessage
        isPrimaryParticipant={isPrimaryParticipant}
        shape={getMessageShape(isFirstInGroup, isLastInGroup)}
        mediaUrl={mediaUrl}
        text={text}
        onLoad={scrollToBottomIfNeeded}
      />
    </Layout>
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
  }),
  scrollToBottomIfNeeded: PropTypes.func
}

export default ImageStructuredMessage
