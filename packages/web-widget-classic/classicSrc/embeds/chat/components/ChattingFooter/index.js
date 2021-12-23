import DesktopFooter from 'classicSrc/embeds/chat/components/ChattingFooter/Desktop'
import MobileFooter from 'classicSrc/embeds/chat/components/ChattingFooter/Mobile'
import {
  getMenuVisible,
  getAttachmentsEnabled,
  getIsChatting,
} from 'classicSrc/embeds/chat/selectors'
import { sendAttachments } from 'classicSrc/redux/modules/chat'
import { getHideZendeskLogo } from 'classicSrc/redux/modules/selectors'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { withTheme } from 'styled-components'

const ChattingFooter = ({
  attachmentsEnabled,
  children,
  endChat,
  sendAttachments,
  hideZendeskLogo,
  isChatting,
  theme,
  isPreview,
  sendChat,
  isComposerFocused,
}) => {
  return theme.isMobile ? (
    <MobileFooter
      attachmentsEnabled={attachmentsEnabled}
      handleAttachmentDrop={sendAttachments}
      isMobile={theme.isMobile}
      isPreview={isPreview}
      sendChat={sendChat}
      isComposerFocused={isComposerFocused}
    >
      {children}
    </MobileFooter>
  ) : (
    <DesktopFooter
      attachmentsEnabled={attachmentsEnabled}
      handleAttachmentDrop={sendAttachments}
      endChat={endChat}
      hideZendeskLogo={hideZendeskLogo}
      isChatting={isChatting}
      isMobile={theme.isMobile}
      isPreview={isPreview}
    >
      {children}
    </DesktopFooter>
  )
}

ChattingFooter.propTypes = {
  attachmentsEnabled: PropTypes.bool.isRequired,
  children: PropTypes.node.isRequired,
  endChat: PropTypes.func,
  sendAttachments: PropTypes.func,
  hideZendeskLogo: PropTypes.bool,
  isChatting: PropTypes.bool,
  isPreview: PropTypes.bool,
  sendChat: PropTypes.func,
  theme: PropTypes.shape({
    isMobile: PropTypes.bool.isRequired,
  }),
  isComposerFocused: PropTypes.bool,
}

const actionCreators = {
  sendAttachments,
}

const mapStateToProps = (state) => ({
  attachmentsEnabled: getAttachmentsEnabled(state),
  menuVisible: getMenuVisible(state),
  isChatting: getIsChatting(state),
  hideZendeskLogo: getHideZendeskLogo(state),
})

const connectedComponent = connect(mapStateToProps, actionCreators)(withTheme(ChattingFooter))

export { connectedComponent as default, ChattingFooter as Component }
