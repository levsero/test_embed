import React from 'react'
import PropTypes from 'prop-types'
import DummyStructuredMessage from '../DummyStructuredMessage'
import Replies from './Replies'

const extractReplies = message => {
  if (!message.isLastInLog) return null
  return message.actions?.filter(action => action.type === 'reply')
}

const TextMessage = ({ message }) => {
  const replies = extractReplies(message)
  return (
    <>
      <DummyStructuredMessage message={message} />
      {replies && <Replies replies={replies} />}
    </>
  )
}

TextMessage.propTypes = {
  message: PropTypes.shape({
    actions: PropTypes.array
  })
}

export default TextMessage
