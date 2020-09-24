import React, { useRef } from 'react'
import { useSelector } from 'react-redux'
import {
  getMessageLog,
  getHasFetchedConversation
} from 'src/apps/messenger/features/messageLog/store'
import Message from 'src/apps/messenger/features/messageLog/Message'
import { Container } from './styles'
import useScrollBehaviour from 'src/apps/messenger/features/messageLog/hooks/useScrollBehaviour'
import useFetchMessages from 'src/apps/messenger/features/messageLog/hooks/useFetchMessages'

const MessageLog = () => {
  const container = useRef(null)
  const messages = useSelector(getMessageLog)
  const hasFetchedConversation = useSelector(getHasFetchedConversation)
  const { onScrollBottom } = useScrollBehaviour({ container, messages })
  const { onScrollTop, isFetchingHistory } = useFetchMessages({
    container,
    messages
  })

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
    <Container
      ref={container}
      role="log"
      aria-live="polite"
      onScroll={event => {
        onScrollBottom(event)
        onScrollTop(event)
      }}
    >
      {isFetchingHistory && fetchingHistory}
      {hasFetchedConversation ? messageLog : loading}
    </Container>
  )
}

export default MessageLog
