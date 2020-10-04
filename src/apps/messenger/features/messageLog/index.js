import React, { useRef } from 'react'
import { useSelector } from 'react-redux'
import { getHasFetchedConversation } from 'src/apps/messenger/features/messageLog/store'
import getMessageLog from 'src/apps/messenger/features/messageLog/getMessageLog'
import Message from 'src/apps/messenger/features/messageLog/Message'
import { Container } from './styles'
import useScrollBehaviour from 'src/apps/messenger/features/messageLog/hooks/useScrollBehaviour'
import useFetchMessages from 'src/apps/messenger/features/messageLog/hooks/useFetchMessages'
import HistoryLoader from './HistoryLoader'

const MessageLog = () => {
  const container = useRef(null)
  const messages = useSelector(getMessageLog)
  const hasFetchedConversation = useSelector(getHasFetchedConversation)
  const { onScrollBottom, scrollToBottomIfNeeded } = useScrollBehaviour({ container, messages })
  const {
    onScrollTop,
    isFetchingHistory,
    errorFetchingHistory,
    retryFetchMessages
  } = useFetchMessages({
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
      <HistoryLoader
        isFetchingHistory={isFetchingHistory}
        hasFetchedConversation={hasFetchedConversation}
        errorFetchingHistory={errorFetchingHistory}
        retryFetchMessages={retryFetchMessages}
      />

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
