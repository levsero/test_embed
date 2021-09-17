import PropTypes from 'prop-types'
import { Spinner } from '@zendeskgarden/react-loaders'
import ReloadStroke from '@zendeskgarden/svg-icons/src/12/reload-stroke.svg'
import { MessageLogError, MessageLogSpinner } from '@zendesk/conversation-components'
import useTranslate from 'src/apps/messenger/features/i18n/useTranslate'
import { TopSpinnerContainer, TopLoadingErrorContainer, LoadingErrorButton } from './styles'

const HistoryLoader = ({
  hasFetchedConversation,
  isFetchingHistory,
  errorFetchingHistory,
  retryFetchMessages,
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

  if (!hasFetchedConversation && isFetchingHistory) return <MessageLogSpinner />

  if (errorFetchingHistory && hasFetchedConversation && !isFetchingHistory)
    return (
      <TopLoadingErrorContainer>
        <LoadingErrorButton isLink={true} onClick={retryFetchMessages}>
          {translate('embeddable_framework.messenger.previous_messages_retry')} <ReloadStroke />
        </LoadingErrorButton>
      </TopLoadingErrorContainer>
    )

  if (errorFetchingHistory && !hasFetchedConversation)
    return <MessageLogError onRetry={retryFetchMessages} />
  return null
}

HistoryLoader.propTypes = {
  hasFetchedConversation: PropTypes.bool.isRequired,
  isFetchingHistory: PropTypes.bool.isRequired,
  errorFetchingHistory: PropTypes.bool.isRequired,
  retryFetchMessages: PropTypes.func.isRequired,
}

export default HistoryLoader
