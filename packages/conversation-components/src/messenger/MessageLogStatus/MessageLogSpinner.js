import { Spinner } from '@zendeskgarden/react-loaders'
import useLabels from 'src/hooks/useLabels'
import { SpinnerContainer } from './styles'

const MessageLogSpinner = () => {
  const labels = useLabels()
  return (
    <SpinnerContainer aria-label={labels.messageLog.initialConversationSpinner}>
      <Spinner />
    </SpinnerContainer>
  )
}

export default MessageLogSpinner
