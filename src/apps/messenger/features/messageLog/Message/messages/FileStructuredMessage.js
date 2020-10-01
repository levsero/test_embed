import React from 'react'
import PropTypes from 'prop-types'
import File from 'src/apps/messenger/features/sunco-components/File'
import getMessageShape from 'src/apps/messenger/features/messageLog/utils/getMessageShape'
import PrimaryParticipantLayout from 'src/apps/messenger/features/sunco-components/Layouts/PrimaryParticipantLayout'
import OtherParticipantLayout from 'src/apps/messenger/features/sunco-components/Layouts/OtherParticipantLayout'

const FileStructuredMessage = ({
  message: {
    avatarUrl,
    isFirstInGroup,
    isLastInGroup,
    isLastInLog,
    isPrimaryParticipant,
    mediaSize,
    mediaUrl,
    name,
    received
  }
}) => {
  const Layout = isPrimaryParticipant ? PrimaryParticipantLayout : OtherParticipantLayout

  return (
    <Layout
      avatar={isLastInGroup ? avatarUrl : undefined}
      label={isFirstInGroup ? name : undefined}
      timeReceived={received}
      isPrimaryParticipant={isPrimaryParticipant}
      isFirstInGroup={isFirstInGroup}
      isLastInLog={isLastInLog}
    >
      <File
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
