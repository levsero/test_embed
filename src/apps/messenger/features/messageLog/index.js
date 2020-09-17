import React, { useRef } from 'react'
import { useSelector } from 'react-redux'
import { getMessageLog } from 'src/apps/messenger/features/messageLog/store'
import Message from 'src/apps/messenger/features/messageLog/Message'
import { Container } from './styles'
import useScrollBehaviour from 'src/apps/messenger/features/messageLog/useScrollBehaviour'

const MessageLog = () => {
  const container = useRef(null)
  const messages = useSelector(getMessageLog)
  const { onScroll, isLoading, isFetchingHistory } = useScrollBehaviour({ container, messages })

  const messageLog = (
    <>
      {messages.map(message => (
        <Message key={message._id} message={message} />
      ))}
    </>
  )

  const loading = <div>loading</div>
  const fetchingHistory = <div>isFetchingHistory</div>

  return (
    <Container ref={container} role="log" aria-live="polite" onScroll={onScroll}>
      {isFetchingHistory && fetchingHistory}
      {isLoading ? loading : messageLog}
    </Container>
  )
}

export default MessageLog
