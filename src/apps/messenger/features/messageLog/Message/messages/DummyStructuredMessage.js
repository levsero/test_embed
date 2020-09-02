import React from 'react'
import PropTypes from 'prop-types'

const DummyStructuredMessage = ({ message }) => {
  const textAlign = message.role === 'appUser' ? 'right' : 'left'
  const backgroundColor = message.role === 'appUser' ? '#618dd4' : '#b3b0b0'

  if (message.isFirstInGroup && message.isLastInGroup) {
    return (
      <div style={{ textAlign, backgroundColor, marginTop: 10 }}>Standalone: {message.text}</div>
    )
  }

  if (message.isFirstInGroup) {
    return <div style={{ textAlign, backgroundColor, marginTop: 10 }}>First: {message.text}</div>
  }

  if (message.isLastInGroup) {
    return <div style={{ textAlign, backgroundColor }}>Last: {message.text}</div>
  }

  return <div style={{ textAlign, backgroundColor }}>Middle: {message.text}</div>
}

DummyStructuredMessage.propTypes = {
  message: PropTypes.shape({
    role: PropTypes.string,
    text: PropTypes.string,
    isFirstInGroup: PropTypes.bool,
    isLastInGroup: PropTypes.bool
  })
}

export default DummyStructuredMessage
