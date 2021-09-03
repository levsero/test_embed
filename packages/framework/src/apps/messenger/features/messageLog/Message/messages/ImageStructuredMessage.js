import PropTypes from 'prop-types'
import { ImageMessage } from '@zendesk/conversation-components'
import getMessageShape from 'src/apps/messenger/features/messageLog/utils/getMessageShape'

const ImageStructuredMessage = ({
  message: {
    role,
    text,
    mediaUrl,
    altText,
    isFirstInGroup,
    isLastInGroup,
    isFirstMessageInAuthorGroup,
    isLastMessageInAuthorGroup,
    avatarUrl,
    name,
    received,
    type,
    status,
  },
}) => {
  const isPrimaryParticipant = role === 'appUser'

  return (
    <ImageMessage
      type={type}
      isPrimaryParticipant={isPrimaryParticipant}
      isFirstInGroup={isFirstInGroup}
      avatar={isLastMessageInAuthorGroup ? avatarUrl : undefined}
      label={isFirstMessageInAuthorGroup ? name : undefined}
      isReceiptVisible={true}
      timeReceived={received}
      shape={getMessageShape(isFirstInGroup, isLastInGroup)}
      mediaUrl={mediaUrl}
      status={status}
      text={text}
      alt={altText}
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
