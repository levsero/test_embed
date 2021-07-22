import PropTypes from 'prop-types'
import { TEST_IDS } from 'src/constants/shared'
import FooterIconButton from 'src/embeds/chat/components/FooterIconButton'
import useTranslate from 'src/hooks/useTranslate'
import { Icon } from './styles'

const SendChatOption = ({ sendChat }) => {
  const translate = useTranslate()
  return (
    <FooterIconButton
      colorType="fill"
      onClick={sendChat}
      aria-label={translate('embeddable_framework.submitTicket.form.submitButton.label.send')}
    >
      <Icon data-testid={TEST_IDS.ICON_SEND_CHAT} />
    </FooterIconButton>
  )
}

SendChatOption.propTypes = {
  sendChat: PropTypes.func,
}

export default SendChatOption
