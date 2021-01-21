import React from 'react'
import PropTypes from 'prop-types'
import {
  CenterSpinnerContainer,
  TopSpinnerContainer,
  CenterLoadingErrorTitle,
  CenterLoadingErrorContainer,
  TopLoadingErrorContainer,
  LoadingErrorButton
} from './styles'
import { Spinner } from '@zendeskgarden/react-loaders'
import ReloadStroke from '@zendeskgarden/svg-icons/src/12/reload-stroke.svg'
import useTranslate from 'src/apps/messenger/features/i18n/useTranslate'

const HistoryLoader = ({
  hasFetchedConversation,
  isFetchingHistory,
  errorFetchingHistory,
  retryFetchMessages
}) => {
  const translate = useTranslate()
  if (hasFetchedConversation && isFetchingHistory)
    return (
      <TopSpinnerContainer
        aria-label={translate('embeddable_framework.messenger.previous_messages_spinner')}
      >
        <Spinner />
      </TopSpinnerContainer>
    )

  if (!hasFetchedConversation && isFetchingHistory)
    return (
      <CenterSpinnerContainer
        aria-label={translate('embeddable_framework.messenger.initial_conversation_spinner')}
      >
        <Spinner />
      </CenterSpinnerContainer>
    )

  if (errorFetchingHistory && hasFetchedConversation && !isFetchingHistory)
    return (
      <TopLoadingErrorContainer>
        <LoadingErrorButton isLink={true} onClick={retryFetchMessages}>
          {translate('embeddable_framework.messenger.previous_messages_retry')} <ReloadStroke />
        </LoadingErrorButton>
      </TopLoadingErrorContainer>
    )

  if (errorFetchingHistory && !hasFetchedConversation)
    return (
      <CenterLoadingErrorContainer>
        <CenterLoadingErrorTitle>
          {translate('embeddable_framework.messenger.initial_conversation_request_failed')}
        </CenterLoadingErrorTitle>
        <LoadingErrorButton isLink={true} onClick={retryFetchMessages}>
          {translate('embeddable_framework.messenger.initial_conversation_retry')} <ReloadStroke />
        </LoadingErrorButton>
      </CenterLoadingErrorContainer>
    )
  return null
}

HistoryLoader.propTypes = {
  hasFetchedConversation: PropTypes.bool.isRequired,
  isFetchingHistory: PropTypes.bool.isRequired,
  errorFetchingHistory: PropTypes.bool.isRequired,
  retryFetchMessages: PropTypes.func.isRequired
}

export default HistoryLoader
