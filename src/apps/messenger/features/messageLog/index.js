import React, { useRef } from 'react'
import { useSelector } from 'react-redux'
import getMessageLog from 'src/apps/messenger/features/messageLog/getMessageLog'
import {
  getErrorFetchingHistory,
  getHasFetchedConversation,
  getIsFetchingHistory
} from 'src/apps/messenger/features/messageLog/store'
import Message from 'src/apps/messenger/features/messageLog/Message'
import useScrollBehaviour from 'src/apps/messenger/features/messageLog/hooks/useScrollBehaviour'
import useFetchMessages from 'src/apps/messenger/features/messageLog/hooks/useFetchMessages'
import HistoryLoader from './HistoryLoader'
import { Container, Log } from './styles'
import SeeLatestButton from 'src/apps/messenger/features/messageLog/SeeLatestButton'

const MessageLog = () => {
  const container = useRef(null)
  const messages = useSelector(getMessageLog)
  const hasFetchedConversation = useSelector(getHasFetchedConversation)
  const errorFetchingHistory = useSelector(getErrorFetchingHistory)
  const isFetchingHistory = useSelector(getIsFetchingHistory)
  const { onScrollBottom, scrollToBottomIfNeeded, scrollToBottom } = useScrollBehaviour({
    container,
    messages
  })
  const { onScrollTop, retryFetchMessages } = useFetchMessages({
    container,
    messages
  })

  return (
    <Container>
      <Log
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

        <SeeLatestButton onClick={scrollToBottom} />
      </Log>
    </Container>
  )
}

export default MessageLog
