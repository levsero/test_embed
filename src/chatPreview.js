import 'src/polyfills';
import 'core-js/es6/map';
import 'core-js/es6/set';

import React from 'react';
import ReactDOM from 'react-dom';
import _ from 'lodash';
import { Provider } from 'react-redux';
import createStore from 'src/redux/createStore';

import Chat from 'component/chat/Chat';
import { Container } from 'component/container/Container';
import Frame from 'component/frame/Frame';
import { i18n } from 'service/i18n';
import { updatePreviewerScreen, updatePreviewerSettings } from 'src/redux/modules/chat';
import { OFFLINE_MESSAGE_SCREEN } from 'src/redux/modules/chat/chat-screen-types';
import {
  UPDATE_PREVIEWER_SCREEN,
  UPDATE_PREVIEWER_SETTINGS,
  PREVIEWER_LOADED } from 'src/redux/modules/chat/chat-action-types';
import { SDK_ACTION_TYPE_PREFIX } from 'constants/chat';
import { MAX_WIDGET_HEIGHT, WIDGET_WIDTH, WIDGET_MARGIN } from 'src/constants/shared';
import { LOCALE_SET } from 'src/redux/modules/base/base-action-types';
import { generateUserWidgetCSS } from 'utility/color/styles';

import { webWidgetStyles } from 'embed/webWidget/webWidgetStyles.js';

const FRAME_WIDTH = WIDGET_WIDTH + WIDGET_MARGIN;
const FRAME_HEIGHT = MAX_WIDGET_HEIGHT + WIDGET_MARGIN;
const BOX_SHADOW_SIZE = 6;

let chatComponent = null;
const defaultOptions = {
  locale: 'en-US',
  color: '#659700',
  styles: {
    float: 'right',
    marginTop: '16px',
    marginRight: '16px',
    width: `${FRAME_WIDTH}px`,
    height: `${FRAME_HEIGHT}px`
  }
};
let frame;

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

  const { width } = options.styles;
  const frameStyle = _.extend({}, options.styles, {
    position: 'relative',
    width: `${parseInt(width) + BOX_SHADOW_SIZE*2}px`,
  });
  const containerStyle = {
    width,
    margin: `${BOX_SHADOW_SIZE}px`
  };

  const allowThrottleActions = (type) => {
    const allowedActions = [
      UPDATE_PREVIEWER_SETTINGS,
      UPDATE_PREVIEWER_SCREEN,
      PREVIEWER_LOADED,
      LOCALE_SET
    ];
    const isSDKActionType = type && type.indexOf(`${SDK_ACTION_TYPE_PREFIX}/`) === 0;

    return isSDKActionType || _.includes(allowedActions, type);
  };

  const store = createStore('chatpreview', { throttleEvents: true, allowedActionsFn: allowThrottleActions });

  i18n.init(store);
  i18n.setLocale(options.locale);

  const frameParams = {
    css: `${require('globalCSS')} ${webWidgetStyles}`,
    name: 'chatPreview',
    customFrameStyle: frameStyle,
    alwaysShow: true,
    ref: (el) => { frame = el.getWrappedInstance(); },
    disableOffsetHorizontal: true,
    preventClose: true,
    generateUserCSS: generateUserWidgetCSS,
    fullscreen: false,
    isMobile: false
  };

  const component = (
    <Provider store={store}>
      <Frame {...frameParams} store={store}>
        <Container
          style={containerStyle}>
          <Chat
            ref={(chat) => chatComponent = chat}
            updateChatBackButtonVisibility={() => {}}
            getFrameContentDocument={() => frame.getContentDocument()}
            style={containerStyle} />
        </Container>
      </Frame>
    </Provider>
  );

  const container = document.createElement('div');

  options.element.appendChild(container);
  ReactDOM.render(component, container);

  const setColor = (color = defaultOptions.color) => {
    frame.setButtonColor(color);
  };

  const updateScreen = (screen) => {
    store.dispatch(updatePreviewerScreen({ screen, status: screen !== OFFLINE_MESSAGE_SCREEN }));
  };

  const updateSettings = (settings) => {
    store.dispatch(updatePreviewerSettings(settings));
  };

  const updateLocale = (locale) => {
    i18n.setLocale(locale, true);
    frame.updateFrameLocale();
    getComponent().getActiveComponent().forceUpdate();
  };

  const updateChatState = (data) => {
    const actionType = data.detail.type
      ? `${SDK_ACTION_TYPE_PREFIX}/${data.detail.type}`
      : `${SDK_ACTION_TYPE_PREFIX}/${data.type}`;

    store.dispatch({ type: actionType, payload: data });
  };

  waitForComponent(() => {
    _.defer(frame.forceUpdateWorld);
    setColor();
  });

  store.dispatch({ type: PREVIEWER_LOADED });

  return {
    _component: frame,
    updateScreen,
    updateSettings,
    updateChatState,
    setColor,
    updateLocale,
    waitForComponent
  };
};

window.zEPreview = { renderPreview };
