import { useDispatch, useSelector } from 'react-redux'
import { MessageLogError, MessageLogSpinner } from '@zendesk/conversation-components'
import {
  getConversationStatus,
  startConversation,
} from 'messengerSrc/features/suncoConversation/store'

const ConversationConnectionStatus = ({ children }) => {
  const conversationStatus = useSelector(getConversationStatus)
  const dispatch = useDispatch()

  if (conversationStatus === 'pending') {
    return <MessageLogSpinner />
  }

  if (conversationStatus === 'failed') {
    return (
      <MessageLogError
        onRetry={() => {
          dispatch(startConversation())
        }}
      />
    )
  }

  return children
}

export default ConversationConnectionStatus
