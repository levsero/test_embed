import React from 'react'
import PropTypes from 'prop-types'
import CarouselStructuredMessage from './messages/CarouselStructuredMessage'
import DummyStructuredMessage from './messages/DummyStructuredMessage'
import FormStructuredMessage from './messages/FormStructuredMessage'
import FormResponseStructuredMessage from './messages/FormResponseStructuredMessage'
import ImageStructuredMessage from './messages/ImageStructuredMessage'
import TextStructuredMessage from './messages/TextStructuredMessage'
import FileStructuredMessage from './messages/FileStructuredMessage'
import TypingIndicator from './messages/TypingIndicator'
import TimestampStructuredMessage from './messages/TimestampStructuredMessage'
import _ from 'lodash'

// Sunco components match with message type (e.g. text, image)
// https://docs.smooch.io/rest/#message-types
const suncoMessageTypes = {
  carousel: CarouselStructuredMessage,
  file: FileStructuredMessage,
  form: FormStructuredMessage,
  formResponse: FormResponseStructuredMessage,
  dummy: DummyStructuredMessage,
  image: ImageStructuredMessage,
  text: TextStructuredMessage
}

const localMessageTypes = {
  dummy: TextStructuredMessage,
  timestamp: TimestampStructuredMessage,
  typingIndicator: TypingIndicator
}

function areEqual(prevProps, nextProps) {
  return _.isEqual(prevProps.message, nextProps.message)
}

const Message = React.memo(({ message, isFreshMessage }) => {
  const messageTypes = message.isLocalMessageType ? localMessageTypes : suncoMessageTypes
  const StructuredMessage = messageTypes[message.type]

  if (!StructuredMessage) {
    return null
  }

  return <StructuredMessage message={message} isFreshMessage={isFreshMessage} />
}, areEqual)

Message.propTypes = {
  message: PropTypes.shape({
    type: PropTypes.string
  }),
  isFreshMessage: PropTypes.bool
}

export default Message
