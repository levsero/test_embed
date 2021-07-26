import PropTypes from 'prop-types'
import ButtonPill from 'src/embeds/chat/components/ButtonPill'
import useTranslate from 'src/hooks/useTranslate'
import { Container } from './styles'

const ReconnectButton = ({ onClick }) => {
  const translate = useTranslate()

  return (
    <Container>
      <ButtonPill onClick={onClick}>
        {translate('embeddable_framework.chat.chatLog.reconnect.label')}
      </ButtonPill>
    </Container>
  )
}

ReconnectButton.propTypes = {
  onClick: PropTypes.func,
}

export default ReconnectButton
