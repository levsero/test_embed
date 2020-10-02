import React, { useRef } from 'react'
import { useSelector } from 'react-redux'
import { getHasFetchedConversation } from 'src/apps/messenger/features/messageLog/store'
import getMessageLog from 'src/apps/messenger/features/messageLog/getMessageLog'
import Message from 'src/apps/messenger/features/messageLog/Message'
import {
  CenterSpinnerContainer,
  TopSpinnerContainer,
  CenterLoadingErrorTitle,
  CenterLoadingErrorContainer,
  CenterLoadingErrorDescription,
  TopLoadingErrorContainer,
  LoadingErrorButton
} from './components/styles'
import { Container } from './styles'
import useScrollBehaviour from 'src/apps/messenger/features/messageLog/hooks/useScrollBehaviour'
import useFetchMessages from 'src/apps/messenger/features/messageLog/hooks/useFetchMessages'
import { Spinner } from '@zendeskgarden/react-loaders'
import ReloadStroke from '@zendeskgarden/svg-icons/src/16/reload-stroke.svg'

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
      {hasFetchedConversation && isFetchingHistory && (
        <TopSpinnerContainer>
          <Spinner />
        </TopSpinnerContainer>
      )}

      {!hasFetchedConversation && isFetchingHistory && (
        <CenterSpinnerContainer>
          <Spinner />
        </CenterSpinnerContainer>
      )}

      {errorFetchingHistory && hasFetchedConversation && (
        <TopLoadingErrorContainer>
          <LoadingErrorButton isLink={true} onClick={retryFetchMessages}>
            Click to retry <ReloadStroke />
          </LoadingErrorButton>
        </TopLoadingErrorContainer>
      )}

      {errorFetchingHistory && !hasFetchedConversation && (
        <CenterLoadingErrorContainer>
          <LoadingErrorButton isLink={true} onClick={retryFetchMessages}>
            <CenterLoadingErrorTitle>messages failed to load</CenterLoadingErrorTitle>
            <CenterLoadingErrorDescription>
              click to retry <ReloadStroke />
            </CenterLoadingErrorDescription>
          </LoadingErrorButton>
        </CenterLoadingErrorContainer>
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
