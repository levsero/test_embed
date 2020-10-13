import React from 'react'
import PropTypes from 'prop-types'
import PrimaryParticipantLayout from 'src/apps/messenger/features/sunco-components/Layouts/PrimaryParticipantLayout'
import OtherParticipantLayout from 'src/apps/messenger/features/sunco-components/Layouts/OtherParticipantLayout'
import TextMessage from 'src/apps/messenger/features/sunco-components/TextMessage'
import Replies from 'src/apps/messenger/features/sunco-components/Replies'
import getMessageShape from 'src/apps/messenger/features/messageLog/utils/getMessageShape'
import { sendMessage } from 'src/apps/messenger/features/messageLog/store'
import { useDispatch } from 'react-redux'
import { MESSAGE_STATUS } from 'src/apps/messenger/features/sunco-components/constants'

const extractReplies = (actions, isLastInLog) => {
  if (!isLastInLog || !actions) return null
  return actions.filter(action => action.type === 'reply')
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
    payload
  }
}) => {
  const dispatch = useDispatch()
  const isPrimaryParticipant = role === 'appUser'
  const Layout = isPrimaryParticipant ? PrimaryParticipantLayout : OtherParticipantLayout
  const replies = extractReplies(actions, isLastInLog)
  const messageStatus = status ?? MESSAGE_STATUS.sent

  return (
    <>
      <Layout
        isFirstInGroup={isFirstInGroup}
        avatar={isLastMessageInAuthorGroup ? avatarUrl : undefined}
        label={isFirstMessageInAuthorGroup ? name : undefined}
        onRetry={() => {
          dispatch(
            sendMessage({
              messageId: _id,
              message: text,
              payload
            })
          )
        }}
        timeReceived={received}
        isReceiptVisible={isLastMessageThatHasntFailed || messageStatus === MESSAGE_STATUS.failed}
        status={messageStatus}
      >
        <TextMessage
          isPrimaryParticipant={isPrimaryParticipant}
          text={text}
          shape={getMessageShape(isFirstInGroup, isLastInGroup)}
          status={messageStatus}
        />
      </Layout>
      {replies && (
        <Replies
          replies={replies}
          onReply={reply => {
            dispatch(
              sendMessage({
                message: reply.text,
                payload: reply.payload
              })
            )
          }}
        />
      )}
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
        type: PropTypes.string
      })
    ),
    avatarUrl: PropTypes.string,
    name: PropTypes.string
  })
}

export default TextStructuredMessage
