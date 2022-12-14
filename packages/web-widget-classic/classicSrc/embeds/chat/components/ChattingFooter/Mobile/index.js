import { TEST_IDS } from 'classicSrc/constants/shared'
import AttachmentOption from 'classicSrc/embeds/chat/components/ChattingFooter/AttachmentOption'
import SendChatOption from 'classicSrc/embeds/chat/components/ChattingFooter/SendChatOption'
import PropTypes from 'prop-types'
import { Container, InputContainer } from './styles'

const ChattingFooterMobile = ({
  attachmentsEnabled,
  children,
  handleAttachmentDrop,
  isMobile,
  isPreview,
  sendChat,
  isComposerFocused,
}) => {
  return (
    <Container data-testid={TEST_IDS.CHAT_FOOTER_MOBILE} isComposerFocused={isComposerFocused}>
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
  isComposerFocused: PropTypes.bool,
  sendChat: PropTypes.func,
}
export default ChattingFooterMobile
