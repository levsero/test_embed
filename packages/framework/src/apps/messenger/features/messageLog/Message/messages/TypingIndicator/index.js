import React from 'react'
import PropTypes from 'prop-types'
import OtherParticipantLayout from 'src/apps/messenger/features/sunco-components/Layouts/OtherParticipantLayout'
import MessageBubble from 'src/apps/messenger/features/sunco-components/MessageBubble'
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
