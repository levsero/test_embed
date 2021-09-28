import PropTypes from 'prop-types'
import ReloadStroke from '@zendeskgarden/svg-icons/src/12/reload-stroke.svg'
import TextButton from 'src/TextButton'
import useLabels from 'src/hooks/useLabels'
import { HistoryErrorContainer } from './styles'

const MessageLogHistoryError = ({ onRetry }) => {
  const labels = useLabels()

  return (
    <HistoryErrorContainer>
      <TextButton onClick={onRetry}>
        {labels.messageLog.messageHistoryRetry} <ReloadStroke />
      </TextButton>
    </HistoryErrorContainer>
  )
}

MessageLogHistoryError.propTypes = {
  onRetry: PropTypes.func,
}

export default MessageLogHistoryError
