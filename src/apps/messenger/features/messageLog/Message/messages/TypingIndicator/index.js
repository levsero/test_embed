import React from 'react'
import PropTypes from 'prop-types'
import OtherParticipantLayout from 'src/apps/messenger/features/sunco-components/Layouts/OtherParticipantLayout'
import MessageBubble from 'src/apps/messenger/features/sunco-components/MessageBubble'
import getMessageShape from 'src/apps/messenger/features/messageLog/utils/getMessageShape'

import { DotLoader } from './styles'

const TypingIndicator = ({ message: { avatarUrl, name } }) => {
  return (
    <OtherParticipantLayout
      avatar={avatarUrl}
      isFirstInGroup={true}
      isReceiptVisible={false}
      label={name}
    >
      <MessageBubble isPrimaryParticipant={false} shape={getMessageShape(true, true)}>
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
