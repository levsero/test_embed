import React from 'react'
import PropTypes from 'prop-types'

import DesktopFooter from 'src/embeds/chat/components/ChattingFooter/Desktop'
import MobileFooter from 'src/embeds/chat/components/ChattingFooter/Mobile'

const ChattingFooter = ({
  attachmentsEnabled,
  children,
  endChat,
  handleAttachmentDrop,
  hideZendeskLogo,
  isChatting,
  isMobile,
  isPreview,
  sendChat
}) => {
  return isMobile ? (
    <MobileFooter
      attachmentsEnabled={attachmentsEnabled}
      handleAttachmentDrop={handleAttachmentDrop}
      isMobile={isMobile}
      isPreview={isPreview}
      sendChat={sendChat}
    >
      {children}
    </MobileFooter>
  ) : (
    <DesktopFooter
      attachmentsEnabled={attachmentsEnabled}
      handleAttachmentDrop={handleAttachmentDrop}
      endChat={endChat}
      hideZendeskLogo={hideZendeskLogo}
      isChatting={isChatting}
      isMobile={isMobile}
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
  handleAttachmentDrop: PropTypes.func,
  hideZendeskLogo: PropTypes.bool,
  isChatting: PropTypes.bool,
  isMobile: PropTypes.bool.isRequired,
  isPreview: PropTypes.bool,
  sendChat: PropTypes.func
}

export default ChattingFooter
