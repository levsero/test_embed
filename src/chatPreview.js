import 'core-js/es6/map';
import 'core-js/es6/set';

import React from 'react';
import ReactDOM from 'react-dom';
import _ from 'lodash';
import createStore from 'src/redux/createStore';

import Chat from 'component/chat/Chat';
import { Container } from 'component/container/Container';
import { Frame } from 'component/frame/Frame';
import { i18n } from 'service/i18n';
import { updatePreviewerScreen, updatePreviewerSettings } from 'src/redux/modules/chat';

import { webWidgetStyles } from 'embed/webWidget/webWidgetStyles.js';

let chatComponent = null;
const defaultOptions = {
  locale: 'en-US',
  color: '#659700',
  styles: {
    float: 'right',
    width: 342,
    marginTop: '16px',
    marginRight: '16px',
    height: 550
  }
};
let preview;

const getComponent = () => {
  return (chatComponent)
    ? chatComponent.getWrappedInstance()
    : null;
};

const waitForComponent = (callback) => {
  const component = getComponent();

  if (component !== null) {
    callback(component);
  } else {
    _.defer(waitForComponent, callback);
  }
};

const renderPreview = (options) => {
  options = _.defaultsDeep({}, options, defaultOptions);

  if (!options.element) {
    throw new Error('A DOM element is required to render the Preview into.');
  }

  i18n.setLocale(options.locale);

  const frameStyle = _.extend({}, options.styles, {
    position: 'relative'
  });
  const containerStyle = {
    width: frameStyle.width
  };
  const store = createStore('chatpreview', { throttleEvents: true });

  const frameParams = {
    css: `${require('globalCSS')} ${webWidgetStyles}`,
    name: 'chatPreview',
    frameStyle,
    disableOffsetHorizontal: true,
    preventClose: true
  };

  const component = (
    <Frame {...frameParams} store={store}>
      <Container
        style={containerStyle}>
        <Chat
          ref={(chat) => chatComponent = chat}
          updateChatBackButtonVisibility={() => {}}
          style={containerStyle} />
      </Container>
    </Frame>
  );

  const container = document.createElement('div');

  options.element.appendChild(container);
  preview = ReactDOM.render(component, container);

  const setColor = (color = defaultOptions.color) => {
    preview.setButtonColor(color);
  };

  const updateScreen = (screen) => {
    store.dispatch(updatePreviewerScreen({ screen, status: screen !== 'widget/chat/OFFLINE_SCREEN' }));
  };

  const updateSettings = (settings) => {
    store.dispatch(updatePreviewerSettings(settings));
  };

  const updateChatState = (data) => {
    const actionType = data.detail.type ? `websdk/${data.detail.type}` : `websdk/${data.type}`;

    store.dispatch({ type: actionType, payload: data });
  };

  waitForComponent(() => {
    _.defer(preview.updateFrameSize);
    setColor();
  });

  return {
    _component: preview,
    updateScreen,
    updateSettings,
    updateChatState,
    setColor
  };
};

window.zE = _.extend(window.zE, { renderPreview });
