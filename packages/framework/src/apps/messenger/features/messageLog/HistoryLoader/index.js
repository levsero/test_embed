import PropTypes from 'prop-types'
import {
  MessageLogError,
  MessageLogSpinner,
  MessageLogHistoryError,
  MessageLogHistorySpinner,
} from '@zendesk/conversation-components'

const HistoryLoader = ({
  hasFetchedConversation,
  isFetchingHistory,
  errorFetchingHistory,
  retryFetchMessages,
}) => {
  if (hasFetchedConversation && isFetchingHistory) {
    return <MessageLogHistorySpinner />
  }

  if (!hasFetchedConversation && isFetchingHistory) {
    return <MessageLogSpinner />
  }

  if (errorFetchingHistory && hasFetchedConversation && !isFetchingHistory) {
    return <MessageLogHistoryError onRetry={retryFetchMessages} />
  }

  if (errorFetchingHistory && !hasFetchedConversation) {
    return <MessageLogError onRetry={retryFetchMessages} />
  }
  return null
}

HistoryLoader.propTypes = {
  hasFetchedConversation: PropTypes.bool.isRequired,
  isFetchingHistory: PropTypes.bool.isRequired,
  errorFetchingHistory: PropTypes.bool.isRequired,
  retryFetchMessages: PropTypes.func.isRequired,
}

export default HistoryLoader
