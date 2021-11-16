import { useRef } from 'react'
import { useSelector } from 'react-redux'
import { MessageLogList, ScrollProvider } from '@zendesk/conversation-components'
import Message from 'messengerSrc/features/messageLog/Message'
import SeeLatestButton from 'messengerSrc/features/messageLog/SeeLatestButton'
import getMessageLog from 'messengerSrc/features/messageLog/getMessageLog'
import useFetchMessages from 'messengerSrc/features/messageLog/hooks/useFetchMessages'
import useScrollBehaviour from 'messengerSrc/features/messageLog/hooks/useScrollBehaviour'
import {
  getErrorFetchingHistory,
  getHasFetchedConversation,
  getIsFetchingHistory,
} from 'messengerSrc/features/messageLog/store'
import HistoryLoader from './HistoryLoader'

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
