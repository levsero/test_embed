import PropTypes from 'prop-types'

import useTranslate from 'src/hooks/useTranslate'
import { Container } from './styles'

const QueuePosition = ({ queuePosition = 1 }) => {
  const translate = useTranslate()

  return (
    <Container role="status" aria-live="polite">
      {translate('embeddable_framework.chat.chatLog.queuePosition', {
        value: queuePosition,
      })}
    </Container>
  )
}

QueuePosition.propTypes = {
  queuePosition: PropTypes.number,
}

export default QueuePosition
