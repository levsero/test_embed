import React from 'react';

import Chat from 'src/component/chat/Chat';
import { i18n } from 'service/i18n';

const noop = () => {};

export const WebWidgetPreview = () => (
  <Chat
    locale={i18n.getLocale()}
    updateChatBackButtonVisibility={noop} />
);
