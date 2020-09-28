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
  const { onScrollBottom, scrollToBottomIfNeeded } = useScrollBehaviour({ container, messages })
  const { onScrollTop, isFetchingHistory } = useFetchMessages({
    container,
    messages
  })

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
      {isFetchingHistory && <div>isFetchingHistory</div>}

      {!hasFetchedConversation && <div>loading</div>}

      {hasFetchedConversation &&
        messages.map(message => (
          <Message
            key={message._id}
            message={message}
            scrollToBottomIfNeeded={scrollToBottomIfNeeded}
          />
        ))}
    </Container>
  )
}

export default MessageLog
