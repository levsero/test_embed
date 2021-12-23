import ZendeskLogo from 'classicSrc/components/ZendeskLogo'
import { TEST_IDS } from 'classicSrc/constants/shared'
import ChatMenu from 'classicSrc/embeds/chat/components/ChatMenu'
import AttachmentOption from 'classicSrc/embeds/chat/components/ChattingFooter/AttachmentOption'
import EndChatOption from 'classicSrc/embeds/chat/components/ChattingFooter/EndChatOption'
import PropTypes from 'prop-types'
import { BottomRow, Footer, IconContainer } from './styles'

const ChattingFooterDesktop = ({
  attachmentsEnabled,
  children,
  endChat,
  handleAttachmentDrop,
  hideZendeskLogo,
  isChatting,
  isMobile,
  isPreview,
}) => {
  return (
    <Footer data-testid={TEST_IDS.CHAT_FOOTER_DESKTOP}>
      {children}
      <BottomRow>
        {!hideZendeskLogo && <ZendeskLogo linkToChat={true} />}

        <IconContainer data-testid={TEST_IDS.CHAT_FOOTER_MENU_BUTTONS}>
          {<EndChatOption endChat={endChat} isChatting={isChatting} />}
          {attachmentsEnabled && (
            <AttachmentOption
              isPreview={isPreview}
              isMobile={isMobile}
              handleAttachmentDrop={handleAttachmentDrop}
            />
          )}
          <ChatMenu />
        </IconContainer>
      </BottomRow>
    </Footer>
  )
}

ChattingFooterDesktop.propTypes = {
  attachmentsEnabled: PropTypes.bool,
  children: PropTypes.node,
  endChat: PropTypes.func,
  handleAttachmentDrop: PropTypes.func,
  hideZendeskLogo: PropTypes.bool,
  isChatting: PropTypes.bool,
  isMobile: PropTypes.bool,
  isPreview: PropTypes.bool,
}

export default ChattingFooterDesktop
