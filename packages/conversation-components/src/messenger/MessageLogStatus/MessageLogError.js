import PropTypes from 'prop-types'
import ReloadStroke from '@zendeskgarden/svg-icons/src/12/reload-stroke.svg'
import TextButton from 'src/TextButton'
import useLabels from 'src/hooks/useLabels'
import { ErrorContainer, ErrorTitle } from './styles'

const MessageLogError = ({ onRetry }) => {
  const labels = useLabels()

  return (
    <ErrorContainer>
      <ErrorTitle>{labels.messageLog.initialConversationRequestFailed}</ErrorTitle>
      <TextButton onClick={onRetry}>
        {labels.messageLog.initialConversationRetry} <ReloadStroke />
      </TextButton>
    </ErrorContainer>
  )
}

MessageLogError.propTypes = {
  onRetry: PropTypes.func,
}

export default MessageLogError
