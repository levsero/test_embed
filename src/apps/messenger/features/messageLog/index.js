import React, { useRef } from 'react'
import { useSelector } from 'react-redux'
import { getMessageLog } from 'src/apps/messenger/features/messageLog/store'
import Message from 'src/apps/messenger/features/messageLog/Message'
import { Container } from './styles'
import useScrollBehaviour from 'src/apps/messenger/features/messageLog/useScrollBehaviour'

const MessageLog = () => {
  const container = useRef(null)
  const messages = useSelector(getMessageLog)
  const onScroll = useScrollBehaviour({ container, messages })

  return (
    <Container ref={container} role="log" aria-live="polite" onScroll={onScroll}>
      {messages.map(message => (
        <Message key={message._id} message={message} />
      ))}
    </Container>
  )
}

export default MessageLog
