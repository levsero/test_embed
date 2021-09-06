import PropTypes from 'prop-types'
import { useDispatch } from 'react-redux'
import { FileMessage, MESSAGE_STATUS } from '@zendesk/conversation-components'
import { sendFile } from 'src/apps/messenger/features/messageLog/store'
import getMessageShape from 'src/apps/messenger/features/messageLog/utils/getMessageShape'

const FileStructuredMessage = ({
  message: {
    _id,
    avatarUrl,
    isFirstInGroup,
    isFirstMessageInAuthorGroup,
    isLastInGroup,
    role,
    isLastMessageInAuthorGroup,
    isLastMessageThatHasntFailed,
    mediaSize,
    mediaUrl,
    altText,
    name,
    received,
    status,
  },
}) => {
  const isPrimaryParticipant = role === 'appUser'
  const dispatch = useDispatch()
  const messageStatus = status ?? MESSAGE_STATUS.sent

  return (
    <FileMessage
      isPrimaryParticipant={isPrimaryParticipant}
      avatar={isLastMessageInAuthorGroup ? avatarUrl : undefined}
      label={isFirstMessageInAuthorGroup ? name : undefined}
      timeReceived={received}
      isFirstInGroup={isFirstInGroup}
      shape={getMessageShape(isFirstInGroup, isLastInGroup)}
      isReceiptVisible={isLastMessageThatHasntFailed || messageStatus === MESSAGE_STATUS.failed}
      mediaSize={mediaSize}
      mediaUrl={mediaUrl}
      altText={altText}
      status={status}
      onRetry={() => dispatch(sendFile({ messageId: _id }))}
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
