import React, { useRef } from 'react'
import { useSelector } from 'react-redux'
import { MessageLogList, ScrollProvider } from '@zendesk/conversation-components'
import getMessageLog from 'src/apps/messenger/features/messageLog/getMessageLog'
import {
  getErrorFetchingHistory,
  getHasFetchedConversation,
  getIsFetchingHistory,
} from 'src/apps/messenger/features/messageLog/store'
import Message from 'src/apps/messenger/features/messageLog/Message'
import useScrollBehaviour from 'src/apps/messenger/features/messageLog/hooks/useScrollBehaviour'
import useFetchMessages from 'src/apps/messenger/features/messageLog/hooks/useFetchMessages'
import HistoryLoader from './HistoryLoader'
import SeeLatestButton from 'src/apps/messenger/features/messageLog/SeeLatestButton'

const MessageLog = () => {
  const container = useRef(null)
  const anchor = useRef(null)
  const messages = useSelector(getMessageLog)
  const hasFetchedConversation = useSelector(getHasFetchedConversation)
  const errorFetchingHistory = useSelector(getErrorFetchingHistory)
  const isFetchingHistory = useSelector(getIsFetchingHistory)
  const {
    onScrollBottom,
    scrollToBottomIfNeeded,
    scrollToBottom,
    scrollToFirstError,
  } = useScrollBehaviour({
    messages,
    container,
    anchor,
  })
  const { onScrollTop, retryFetchMessages } = useFetchMessages({
    container,
    messages,
  })

  const messageLogOpened = useRef(Date.now() / 1000)

  return (
    <ScrollProvider value={{ scrollToBottomIfNeeded, scrollToFirstError }}>
      <MessageLogList
        ref={container}
        onScroll={(event) => {
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
          messages.map((message) => (
            <Message
              key={message._id}
              message={message}
              isFreshMessage={message.received > messageLogOpened.current}
            />
          ))}

        <div ref={anchor} style={{ height: 1 }} />

        <SeeLatestButton onClick={scrollToBottom} />
      </MessageLogList>
    </ScrollProvider>
  )
}

export default MessageLog
