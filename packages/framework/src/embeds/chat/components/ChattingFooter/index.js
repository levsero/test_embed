import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { withTheme } from 'styled-components'
import DesktopFooter from 'src/embeds/chat/components/ChattingFooter/Desktop'
import MobileFooter from 'src/embeds/chat/components/ChattingFooter/Mobile'
import { getMenuVisible } from 'src/embeds/chat/selectors'
import { sendAttachments } from 'src/redux/modules/chat'
import * as chatSelectors from 'src/redux/modules/chat/chat-selectors'
import { getHideZendeskLogo } from 'src/redux/modules/selectors'

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
}) => {
  return theme.isMobile ? (
    <MobileFooter
      attachmentsEnabled={attachmentsEnabled}
      handleAttachmentDrop={sendAttachments}
      isMobile={theme.isMobile}
      isPreview={isPreview}
      sendChat={sendChat}
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
}

const actionCreators = {
  sendAttachments,
}

const mapStateToProps = (state) => ({
  attachmentsEnabled: chatSelectors.getAttachmentsEnabled(state),
  menuVisible: getMenuVisible(state),
  isChatting: chatSelectors.getIsChatting(state),
  hideZendeskLogo: getHideZendeskLogo(state),
})

const connectedComponent = connect(mapStateToProps, actionCreators)(withTheme(ChattingFooter))

export { connectedComponent as default, ChattingFooter as Component }
