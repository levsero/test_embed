import PropTypes from 'prop-types'
import { TEST_IDS } from 'src/constants/shared'
import AttachmentOption from 'src/embeds/chat/components/ChattingFooter/AttachmentOption'
import SendChatOption from 'src/embeds/chat/components/ChattingFooter/SendChatOption'
import { Container, InputContainer } from './styles'

const ChattingFooterMobile = ({
  attachmentsEnabled,
  children,
  handleAttachmentDrop,
  isMobile,
  isPreview,
  sendChat,
}) => {
  return (
    <Container data-testid={TEST_IDS.CHAT_FOOTER_MOBILE}>
      {attachmentsEnabled && (
        <AttachmentOption
          isPreview={isPreview}
          isMobile={isMobile}
          handleAttachmentDrop={handleAttachmentDrop}
        />
      )}
      <InputContainer>{children}</InputContainer>
      <SendChatOption sendChat={sendChat} />
    </Container>
  )
}

ChattingFooterMobile.propTypes = {
  attachmentsEnabled: PropTypes.bool,
  children: PropTypes.node,
  handleAttachmentDrop: PropTypes.func,
  isMobile: PropTypes.bool,
  isPreview: PropTypes.bool,
  sendChat: PropTypes.func,
}
export default ChattingFooterMobile
