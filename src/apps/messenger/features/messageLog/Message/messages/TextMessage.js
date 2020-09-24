import React from 'react'
import PropTypes from 'prop-types'
import Text from 'src/apps/messenger/features/sunco-components/Text'
import Replies from 'src/apps/messenger/features/sunco-components/Replies'

import { getClient } from 'src/apps/messenger/suncoClient'

const extractReplies = (actions, isLastInLog) => {
  if (!isLastInLog || !actions) return null
  return actions.filter(action => action.type === 'reply')
}

const TextMessage = ({
  message: {
    actions,
    avatarUrl,
    isFirstInGroup,
    isLastInGroup,
    isLastInLog,
    name,
    received,
    role,
    text
  }
}) => {
  const replies = extractReplies(actions, isLastInLog)

  return (
    <>
      <Text
        isFirstInGroup={isFirstInGroup}
        isLastInGroup={isLastInGroup}
        text={text}
        role={role}
        avatar={isLastInGroup ? avatarUrl : undefined}
        label={isFirstInGroup ? name : undefined}
        isLastInLog={isLastInLog}
        timeReceived={received}
      />
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

TextMessage.propTypes = {
  message: PropTypes.shape({
    avatarUrl: PropTypes.string,
    isFirstInGroup: PropTypes.bool,
    isLastInGroup: PropTypes.bool,
    isLastInLog: PropTypes.bool,
    received: PropTypes.number,
    role: PropTypes.string,
    text: PropTypes.string
  })
}

export default TextMessage
