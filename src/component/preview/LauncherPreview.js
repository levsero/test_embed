import React, { Component } from 'react'

import ChatBadge from 'src/component/launcher/ChatBadge'

const noop = () => {}

export class LauncherPreview extends Component {
  render() {
    return (
      <ChatBadge
        onSend={noop}
        handleChatBadgeMessageChange={noop}
        resetCurrentMessage={noop}
        sendMsg={noop}
        handleChatBadgeMinimize={noop}
        updateChatScreen={noop}
        chatBadgeClicked={noop}
        prechatFormRequired={false}
        hideBranding={false}
      />
    )
  }
}
