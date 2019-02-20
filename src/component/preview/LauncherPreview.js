import React from 'react';

import ChatBadge from 'src/component/launcher/ChatBadge';

const noop = () => {};

export const LauncherPreview = () => (
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
);
