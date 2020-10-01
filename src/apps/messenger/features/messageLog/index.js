import React, { useRef } from 'react'
import { useSelector } from 'react-redux'
import {
  getMessageLog,
  getHasFetchedConversation
} from 'src/apps/messenger/features/messageLog/store'
import Message from 'src/apps/messenger/features/messageLog/Message'
import { Container, CenterSpinnerContainer, TopSpinnerContainer } from './styles'
import useScrollBehaviour from 'src/apps/messenger/features/messageLog/hooks/useScrollBehaviour'
import useFetchMessages from 'src/apps/messenger/features/messageLog/hooks/useFetchMessages'
import { Spinner } from '@zendeskgarden/react-loaders'

const MessageLog = () => {
  const container = useRef(null)
  const messages = useSelector(getMessageLog)
  const hasFetchedConversation = useSelector(getHasFetchedConversation)
  const { onScrollBottom, scrollToBottomIfNeeded } = useScrollBehaviour({
    container,
    messages
  })
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
      {isFetchingHistory && (
        <TopSpinnerContainer>
          <Spinner />
        </TopSpinnerContainer>
      )}

      {!hasFetchedConversation && (
        <CenterSpinnerContainer>
          <Spinner />
        </CenterSpinnerContainer>
      )}
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
