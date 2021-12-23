import { TEST_IDS } from 'classicSrc/constants/shared'
import ChatModal, { ModalActions } from 'classicSrc/embeds/chat/components/ChatModal'
import useTranslate from 'classicSrc/hooks/useTranslate'
import PropTypes from 'prop-types'
import { Button } from '@zendeskgarden/react-buttons'
import { ChatEndModalDescription } from './styles'

const EndChatModal = ({ endChatViaPostChatScreen, onClose }) => {
  const translate = useTranslate()

  const endChat = () => {
    onClose()
    endChatViaPostChatScreen()
  }

  return (
    <ChatModal onClose={onClose} focusOnMount={true} data-testid={TEST_IDS.CHAT_END_MODAL}>
      <ChatEndModalDescription>
        {translate('embeddable_framework.chat.form.endChat.description')}
      </ChatEndModalDescription>
      <ModalActions>
        <Button
          onClick={onClose}
          data-testid={TEST_IDS.BUTTON_CANCEL}
          aria-label={translate('embeddable_framework.common.button.cancel')}
        >
          {translate('embeddable_framework.common.button.cancel')}
        </Button>
        <Button
          onClick={endChat}
          isPrimary={true}
          aria-label={translate('embeddable_framework.common.button.end')}
          data-testid={TEST_IDS.BUTTON_OK}
        >
          {translate('embeddable_framework.common.button.end')}
        </Button>
      </ModalActions>
    </ChatModal>
  )
}

EndChatModal.propTypes = {
  endChatViaPostChatScreen: PropTypes.func.isRequired,
  onClose: PropTypes.func.isRequired,
}

export default EndChatModal
