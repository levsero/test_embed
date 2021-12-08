import ChatBadge from 'classicSrc/component/launcher/ChatBadge'
import { Component } from 'react'

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
        isPreviewer={true}
      />
    )
  }
}
