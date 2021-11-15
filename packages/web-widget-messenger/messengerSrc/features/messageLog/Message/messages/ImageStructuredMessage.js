import PropTypes from 'prop-types'
import { useState } from 'react'
import { useDispatch } from 'react-redux'
import { ImageMessage, MESSAGE_STATUS } from '@zendesk/conversation-components'
import { sendFile } from 'messengerSrc/features/messageLog/store'
import getMessageShape from 'messengerSrc/features/messageLog/utils/getMessageShape'
import FileStructuredMessage from './FileStructuredMessage'

const ImageStructuredMessage = ({ message }) => {
  const {
    _id,
    role,
    text,
    mediaUrl,
    blobMediaUrl,
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
    errorReason,
    isRetryable,
  } = message
  const [hasFailedLoadingImage, setHasFailedLoadingImage] = useState(false)
  const handleImageLoadError = () => {
    setHasFailedLoadingImage(true)
  }
  const isPrimaryParticipant = role === 'appUser'
  const dispatch = useDispatch()
  const messageStatus = status ?? MESSAGE_STATUS.sent

  if (hasFailedLoadingImage) return <FileStructuredMessage message={message} />

  return (
    <ImageMessage
      isPrimaryParticipant={isPrimaryParticipant}
      isFirstInGroup={isFirstInGroup}
      avatar={isLastMessageInAuthorGroup ? avatarUrl : undefined}
      label={isFirstMessageInAuthorGroup ? name : undefined}
      timeReceived={received}
      shape={getMessageShape(isFirstInGroup, isLastInGroup)}
      isReceiptVisible={isLastMessageThatHasntFailed || messageStatus === MESSAGE_STATUS.failed}
      mediaUrl={mediaUrl}
      src={blobMediaUrl}
      text={text}
      alt={altText}
      type={type}
      status={status}
      errorReason={errorReason}
      isRetryable={isRetryable}
      onRetry={() => dispatch(sendFile({ messageId: _id }))}
      onError={handleImageLoadError}
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
    isRetryable: PropTypes.bool,
  }),
}

export default ImageStructuredMessage
