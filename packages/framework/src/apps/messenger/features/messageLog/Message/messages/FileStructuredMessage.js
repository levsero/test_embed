import PropTypes from 'prop-types'
import { FileMessage } from '@zendesk/conversation-components'
import getMessageShape from 'src/apps/messenger/features/messageLog/utils/getMessageShape'

const FileStructuredMessage = ({
  message: {
    avatarUrl,
    isFirstInGroup,
    isFirstMessageInAuthorGroup,
    isLastInGroup,
    role,
    isLastMessageInAuthorGroup,
    mediaSize,
    mediaUrl,
    altText,
    name,
    received,
    status,
  },
}) => {
  const isPrimaryParticipant = role === 'appUser'
  return (
    <FileMessage
      isPrimaryParticipant={isPrimaryParticipant}
      avatar={isLastMessageInAuthorGroup ? avatarUrl : undefined}
      label={isFirstMessageInAuthorGroup ? name : undefined}
      timeReceived={received}
      isFirstInGroup={isFirstInGroup}
      shape={getMessageShape(isFirstInGroup, isLastInGroup)}
      mediaSize={mediaSize}
      mediaUrl={mediaUrl}
      altText={altText}
      status={status}
    />
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
    received: PropTypes.number,
    altText: PropTypes.string,
  }),
}

export default FileStructuredMessage
