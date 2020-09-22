import React from 'react'
import PropTypes from 'prop-types'
import DummyStructuredMessage from 'src/apps/messenger/features/messageLog/Message/messages/DummyStructuredMessage'
import TextMessage from 'src/apps/messenger/features/messageLog/Message/messages/TextMessage'
import CarouselStructuredMessage from './messages/CarouselStructuredMessage'

// Sunco components match with message type (e.g. text, image)
// https://docs.smooch.io/rest/#message-types
const suncoMessageTypes = {
  dummy: DummyStructuredMessage,
  text: TextMessage,
  carousel: CarouselStructuredMessage
}

const localMessageTypes = {
  dummy: TextMessage
}

const Message = ({ message }) => {
  const messageTypes = message.isLocalMessageType ? localMessageTypes : suncoMessageTypes
  const StructuredMessage = messageTypes[message.type]

  if (!StructuredMessage) {
    return null
  }

  return <StructuredMessage message={message} />
}

Message.propTypes = {
  message: PropTypes.shape({
    type: PropTypes.string
  })
}

export default Message
