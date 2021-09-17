import { Spinner } from '@zendeskgarden/react-loaders'
import useLabels from 'src/hooks/useLabels'
import { HistorySpinnerContainer } from './styles'

const MessageLogHistorySpinner = () => {
  const labels = useLabels()

  return (
    <HistorySpinnerContainer aria-label={labels.messageLog.messageHistorySpinner}>
      <Spinner />
    </HistorySpinnerContainer>
  )
}

export default MessageLogHistorySpinner
