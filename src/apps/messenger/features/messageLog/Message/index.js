import React from 'react'
import PropTypes from 'prop-types'
import CarouselStructuredMessage from './messages/CarouselStructuredMessage'
import DummyStructuredMessage from './messages/DummyStructuredMessage'
import FormMessage from './messages/FormMessage'
import FormResponseMessage from './messages/FormResponseMessage'
import ImageStructuredMessage from './messages/ImageStructuredMessage'
import TextStructuredMessage from './messages/TextStructuredMessage'

// Sunco components match with message type (e.g. text, image)
// https://docs.smooch.io/rest/#message-types
const suncoMessageTypes = {
  carousel: CarouselStructuredMessage,
  dummy: DummyStructuredMessage,
  form: FormMessage,
  formResponse: FormResponseMessage,
  image: ImageStructuredMessage,
  text: TextStructuredMessage
}

const localMessageTypes = {
  dummy: TextStructuredMessage
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
