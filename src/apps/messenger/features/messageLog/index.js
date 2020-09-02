import React from 'react'
import { useSelector } from 'react-redux'
import { getMessageLog } from 'src/apps/messenger/features/messageLog/store'
import Message from 'src/apps/messenger/features/messageLog/Message'
import { Container } from './styles'

const MessageLog = () => {
  const messages = useSelector(getMessageLog)

  return (
    <Container role="log" aria-live="polite">
      {messages.map(message => (
        <Message key={message._id} message={message} />
      ))}
    </Container>
  )
}

export default MessageLog
