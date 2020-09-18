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
  message: { role, text, isFirstInGroup, isLastInGroup, actions, isLastInLog }
}) => {
  const replies = extractReplies(actions, isLastInLog)

  return (
    <>
      <Text isFirstInGroup={isFirstInGroup} isLastInGroup={isLastInGroup} text={text} role={role} />
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
    role: PropTypes.string,
    text: PropTypes.string,
    isFirstInGroup: PropTypes.bool,
    isLastInGroup: PropTypes.bool
  })
}

export default TextMessage
