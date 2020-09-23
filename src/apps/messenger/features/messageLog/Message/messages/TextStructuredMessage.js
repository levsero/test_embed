import React from 'react'
import PropTypes from 'prop-types'
import PrimaryParticipantLayout from 'src/apps/messenger/features/sunco-components/Layouts/PrimaryParticipantLayout'
import OtherParticipantLayout from 'src/apps/messenger/features/sunco-components/Layouts/OtherParticipantLayout'
import TextMessage from 'src/apps/messenger/features/sunco-components/TextMessage'
import Replies from 'src/apps/messenger/features/sunco-components/Replies'
import getMessageShape from 'src/apps/messenger/features/messageLog/utils/getMessageShape'
import { getClient } from 'src/apps/messenger/suncoClient'

const extractReplies = (actions, isLastInLog) => {
  if (!isLastInLog || !actions) return null
  return actions.filter(action => action.type === 'reply')
}

const TextStructuredMessage = ({
  message: { role, text, isFirstInGroup, isLastInGroup, isLastInLog, actions, avatarUrl, name }
}) => {
  const isPrimaryParticipant = role === 'appUser'
  const Layout = isPrimaryParticipant ? PrimaryParticipantLayout : OtherParticipantLayout
  const replies = extractReplies(actions, isLastInLog)

  return (
    <>
      <Layout
        isFirstInGroup={isFirstInGroup}
        avatar={isLastInGroup ? avatarUrl : undefined}
        label={isFirstInGroup ? name : undefined}
      >
        <TextMessage
          isPrimaryParticipant={isPrimaryParticipant}
          text={text}
          shape={getMessageShape(isFirstInGroup, isLastInGroup)}
        />
      </Layout>
      {replies && (
        <Replies
          replies={replies}
          submitReply={message => {
            const client = getClient()
            client.sendMessage(message)
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
