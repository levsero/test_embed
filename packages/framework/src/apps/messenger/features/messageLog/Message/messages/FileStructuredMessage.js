import React from 'react'
import PropTypes from 'prop-types'
import {
  FileMessage,
  PrimaryParticipantLayout,
  OtherParticipantLayout
} from '@zendesk/conversation-components'
import getMessageShape from 'src/apps/messenger/features/messageLog/utils/getMessageShape'

const FileStructuredMessage = ({
  message: {
    avatarUrl,
    isFirstInGroup,
    isFirstMessageInAuthorGroup,
    isLastInGroup,
    isLastInLog,
    isPrimaryParticipant,
    isLastMessageInAuthorGroup,
    mediaSize,
    mediaUrl,
    name,
    received
  }
}) => {
  const Layout = isPrimaryParticipant ? PrimaryParticipantLayout : OtherParticipantLayout

  return (
    <Layout
      avatar={isLastMessageInAuthorGroup ? avatarUrl : undefined}
      label={isFirstMessageInAuthorGroup ? name : undefined}
      timeReceived={received}
      isPrimaryParticipant={isPrimaryParticipant}
      isFirstInGroup={isFirstInGroup}
      isLastInLog={isLastInLog}
    >
      <FileMessage
        isPrimaryParticipant={isPrimaryParticipant}
        shape={getMessageShape(isFirstInGroup, isLastInGroup)}
        mediaSize={mediaSize}
        mediaUrl={mediaUrl}
      />
    </Layout>
  )
}

FileStructuredMessage.propTypes = {
  message: PropTypes.shape({
    avatarUrl: PropTypes.string,
    isFirstInGroup: PropTypes.bool,
    isLastInGroup: PropTypes.bool,
    isLastInLog: PropTypes.bool,
    isPrimaryParticipant: PropTypes.bool,
    mediaSize: PropTypes.number,
    mediaUrl: PropTypes.string,
    name: PropTypes.string,
    received: PropTypes.number
  })
}

export default FileStructuredMessage
