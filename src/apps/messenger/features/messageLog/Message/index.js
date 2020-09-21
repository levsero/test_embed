import React from 'react'
import PropTypes from 'prop-types'
import CarouselStructuredMessage from './messages/CarouselStructuredMessage'
import DummyStructuredMessage from 'src/apps/messenger/features/messageLog/Message/messages/DummyStructuredMessage'
import FormMessage from 'src/apps/messenger/features/messageLog/Message/messages/FormMessage'
import FormResponseMessage from 'src/apps/messenger/features/messageLog/Message/messages/FormResponseMessage'
import ImageStructuredMessage from 'src/apps/messenger/features/messageLog/Message/messages/ImageStructuredMessage'
import TextMessage from 'src/apps/messenger/features/messageLog/Message/messages/TextMessage'

// Sunco components match with message type (e.g. text, image)
// https://docs.smooch.io/rest/#message-types
const suncoMessageTypes = {
  carousel: CarouselStructuredMessage,
  dummy: DummyStructuredMessage,
  form: FormMessage,
  formResponse: FormResponseMessage,
  image: ImageStructuredMessage,
  text: TextMessage
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
