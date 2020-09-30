import React from 'react'
import PropTypes from 'prop-types'

import {
  MESSAGE_BUBBLE_SHAPES,
  MESSAGE_STATUS
} from 'src/apps/messenger/features/sunco-components/constants'
import MessageBubble from 'src/apps/messenger/features/sunco-components/MessageBubble'
import { Text, Content } from './styles'

const TextMessage = ({ isPrimaryParticipant, text, shape, status }) => {
  return (
    <MessageBubble shape={shape} isPrimaryParticipant={isPrimaryParticipant} status={status}>
      <Content>
        <Text>{text}</Text>
      </Content>
    </MessageBubble>
  )
}

TextMessage.propTypes = {
  isPrimaryParticipant: PropTypes.bool,
  text: PropTypes.string,
  shape: PropTypes.oneOf(Object.values(MESSAGE_BUBBLE_SHAPES)),
  status: PropTypes.oneOf(Object.values(MESSAGE_STATUS))
}

export default TextMessage
