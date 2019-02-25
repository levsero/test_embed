import React, { Component } from 'react';

import Chat from 'src/component/chat/Chat';
import { i18n } from 'service/i18n';

const noop = () => {};

export class WebWidgetPreview extends Component {
  render() {
    return (
      <Chat
        locale={i18n.getLocale()}
        updateChatBackButtonVisibility={noop}
        getFrameContentDocument={noop} />
    );
  }
}
