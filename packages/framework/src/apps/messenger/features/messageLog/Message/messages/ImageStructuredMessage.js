import PropTypes from 'prop-types'
import { useDispatch } from 'react-redux'
import { ImageMessage, MESSAGE_STATUS } from '@zendesk/conversation-components'
import { sendFile } from 'src/apps/messenger/features/messageLog/store'
import getMessageShape from 'src/apps/messenger/features/messageLog/utils/getMessageShape'

const ImageStructuredMessage = ({
  message: {
    _id,
    role,
    text,
    mediaUrl,
    altText,
    isFirstInGroup,
    isLastInGroup,
    isFirstMessageInAuthorGroup,
    isLastMessageInAuthorGroup,
    isLastMessageThatHasntFailed,
    avatarUrl,
    name,
    received,
    type,
    status,
  },
}) => {
  const isPrimaryParticipant = role === 'appUser'
  const dispatch = useDispatch()
  const messageStatus = status ?? MESSAGE_STATUS.sent

  return (
    <ImageMessage
      type={type}
      isPrimaryParticipant={isPrimaryParticipant}
      isFirstInGroup={isFirstInGroup}
      avatar={isLastMessageInAuthorGroup ? avatarUrl : undefined}
      label={isFirstMessageInAuthorGroup ? name : undefined}
      timeReceived={received}
      shape={getMessageShape(isFirstInGroup, isLastInGroup)}
      isReceiptVisible={isLastMessageThatHasntFailed || messageStatus === MESSAGE_STATUS.failed}
      mediaUrl={mediaUrl}
      status={status}
      text={text}
      alt={altText}
      onRetry={() => dispatch(sendFile({ messageId: _id }))}
    />
  )
}

ImageStructuredMessage.propTypes = {
  message: PropTypes.shape({
    role: PropTypes.string,
    text: PropTypes.string,
    altText: PropTypes.string,
    mediaUrl: PropTypes.string,
    isFirstInGroup: PropTypes.bool,
    isLastMessageThatHasntFailed: PropTypes.bool,
    isLastInLog: PropTypes.bool,
    avatarUrl: PropTypes.string,
    name: PropTypes.string,
    received: PropTypes.number,
  }),
}

export default ImageStructuredMessage
