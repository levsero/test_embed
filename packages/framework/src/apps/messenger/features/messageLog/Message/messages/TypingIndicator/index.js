import React from 'react'
import PropTypes from 'prop-types'
import { MessageBubble, OtherParticipantLayout } from '@zendesk/conversation-components'
import getMessageShape from 'src/apps/messenger/features/messageLog/utils/getMessageShape'

import { DotLoader } from './styles'

const TypingIndicator = ({
  message: { avatarUrl, name, isFirstInGroup, isLastInGroup, isFirstMessageInAuthorGroup, _id }
}) => {
  return (
    <OtherParticipantLayout
      avatar={avatarUrl}
      isFirstInGroup={isFirstInGroup}
      isReceiptVisible={false}
      label={isFirstMessageInAuthorGroup ? name : undefined}
    >
      <MessageBubble
        isPrimaryParticipant={false}
        shape={getMessageShape(isFirstInGroup, isLastInGroup)}
      >
        <DotLoader />
      </MessageBubble>
    </OtherParticipantLayout>
  )
}

TypingIndicator.propTypes = {
  message: PropTypes.shape({
    avatarUrl: PropTypes.string,
    name: PropTypes.string
  })
}
export default TypingIndicator
