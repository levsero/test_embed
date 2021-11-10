import PropTypes from 'prop-types'
import { useDispatch } from 'react-redux'
import { TextMessage, Replies, MESSAGE_STATUS } from '@zendesk/conversation-components'
import { sendMessage } from 'messengerSrc/features/messageLog/store'
import getMessageShape from 'messengerSrc/features/messageLog/utils/getMessageShape'

const extractReplies = (actions) => {
  return actions?.filter((action) => action.type === 'reply') ?? []
}

const TextStructuredMessage = ({
  message: {
    _id,
    role,
    text,
    isFirstInGroup,
    isFirstMessageInAuthorGroup,
    isLastMessageInAuthorGroup,
    isLastInGroup,
    isLastInLog,
    actions,
    avatarUrl,
    name,
    received,
    status,
    isLastMessageThatHasntFailed,
    payload,
    metadata,
  },
  isFreshMessage,
}) => {
  const dispatch = useDispatch()
  const isPrimaryParticipant = role === 'appUser'
  const replies = extractReplies(actions)
  const messageStatus = status ?? MESSAGE_STATUS.sent

  return (
    <>
      <TextMessage
        isPrimaryParticipant={isPrimaryParticipant}
        isFirstInGroup={isFirstInGroup}
        avatar={isLastMessageInAuthorGroup ? avatarUrl : undefined}
        label={isFirstMessageInAuthorGroup ? name : undefined}
        text={text}
        timeReceived={received}
        isReceiptVisible={isLastMessageThatHasntFailed || messageStatus === MESSAGE_STATUS.failed}
        shape={getMessageShape(isFirstInGroup, isLastInGroup)}
        status={messageStatus}
        isFreshMessage={isFreshMessage}
        onRetry={() => {
          dispatch(
            sendMessage({
              messageId: _id,
              message: text,
              payload,
              metadata,
            })
          )
        }}
      />
      <Replies
        isFreshMessage={isFreshMessage}
        isVisible={isLastInLog}
        replies={replies}
        onReply={(reply) => {
          dispatch(
            sendMessage({
              message: reply.text,
              payload: reply.payload,
              metadata: reply.metadata,
            })
          )
        }}
      />
    </>
  )
}

TextStructuredMessage.propTypes = {
  message: PropTypes.shape({
    role: PropTypes.string,
    text: PropTypes.string,
    isFirstInGroup: PropTypes.bool,
    isLastInGroup: PropTypes.bool,
    isLastInLog: PropTypes.bool,
    isLastMessageThatHasntFailed: PropTypes.bool,
    actions: PropTypes.arrayOf(
      PropTypes.shape({
        _id: PropTypes.string,
        type: PropTypes.string,
      })
    ),
    metadata: PropTypes.objectOf(PropTypes.any),
    avatarUrl: PropTypes.string,
    name: PropTypes.string,
    status: PropTypes.string,
    received: PropTypes.number,
  }),
  isFreshMessage: PropTypes.bool,
}

export default TextStructuredMessage
