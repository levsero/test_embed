import 'src/polyfills';
import 'core-js/es6/map';
import 'core-js/es6/set';

import React from 'react';
import ReactDOM from 'react-dom';
import _ from 'lodash';
import { Provider } from 'react-redux';
import createStore from 'src/redux/createStore';

import { i18n } from 'service/i18n';
import { updatePreviewerScreen, updatePreviewerSettings } from 'src/redux/modules/chat';
import { OFFLINE_MESSAGE_SCREEN } from 'src/redux/modules/chat/chat-screen-types';
import {
  UPDATE_PREVIEWER_SCREEN,
  UPDATE_PREVIEWER_SETTINGS,
  PREVIEWER_LOADED
} from 'src/redux/modules/chat/chat-action-types';
import { SDK_ACTION_TYPE_PREFIX } from 'constants/chat';
import { LOCALE_SET } from 'src/redux/modules/base/base-action-types';
import { updateSettings as updateColor } from 'src/redux/modules/settings';
import { UPDATE_SETTINGS } from 'src/redux/modules/settings/settings-action-types';
import { choosePreview } from 'src/redux/modules/preview/preview-actions';
import { CHAT, CHAT_BADGE } from 'src/constants/preview';
import { PREVIEW_CHOICE_SELECTED } from 'src/redux/modules/preview/preview-action-types';
import PreviewContainer from 'src/component/preview/PreviewContainer';
import { MAX_WIDGET_HEIGHT, WIDGET_WIDTH, WIDGET_MARGIN } from 'src/constants/shared';

const FRAME_WIDTH = WIDGET_WIDTH + WIDGET_MARGIN;
const FRAME_HEIGHT = MAX_WIDGET_HEIGHT + WIDGET_MARGIN;
const BOX_SHADOW_SIZE = 6;

let previewContainer = null;

const defaultOptions = {
  locale: 'en-US',
  color: '#1F73B7',
  styles: {
    float: 'right',
    marginTop: '16px',
    marginRight: '16px',
    width: `${FRAME_WIDTH}px`,
    height: `${FRAME_HEIGHT}px`
  }
};

const waitForComponent = (callback) => {
  if (previewContainer) {
    callback();
  } else {
    _.defer(waitForComponent, callback);
  }
};

const renderPreview = (options) => {
  options = _.defaultsDeep({}, options, defaultOptions);

  if (!options.element) {
    throw new Error('A DOM element is required to render the Preview into.');
  }

  const allowThrottleActions = (type) => {
    const allowedActions = [
      UPDATE_PREVIEWER_SETTINGS,
      UPDATE_PREVIEWER_SCREEN,
      PREVIEWER_LOADED,
      LOCALE_SET,
      UPDATE_SETTINGS,
      PREVIEW_CHOICE_SELECTED
    ];

    const isSDKActionType = type && type.indexOf(`${SDK_ACTION_TYPE_PREFIX}/`) === 0;

    return isSDKActionType || _.includes(allowedActions, type);
  };
  const store = createStore('chatpreview', { throttleEvents: true, allowedActionsFn: allowThrottleActions });

  const setColor = (color = defaultOptions.color) => {
    store.dispatch(updateColor({ color: { theme: color, button: color } }));
  };

  const updateScreen = (screen) => {
    store.dispatch(updatePreviewerScreen({ screen, status: screen !== OFFLINE_MESSAGE_SCREEN }));

    if (screen === CHAT_BADGE) {
      store.dispatch(choosePreview(CHAT_BADGE));
    } else {
      store.dispatch(choosePreview(CHAT));
    }
  };

  const updateSettings = (settings) => {
    store.dispatch(updatePreviewerSettings(settings));
  };

  const updateLocale = (locale) => {
    i18n.setLocale(locale, () => {
      waitForComponent(() => {
        previewContainer.updateFrameLocale();
      });
    });
  };

  const updateChatState = (data) => {
    const actionType = data.detail.type
      ? `${SDK_ACTION_TYPE_PREFIX}/${data.detail.type}`
      : `${SDK_ACTION_TYPE_PREFIX}/${data.type}`;

    store.dispatch({ type: actionType, payload: data });
  };

  const renderComponent = () => {
    store.dispatch(choosePreview(CHAT));

    const { width } = options.styles;
    const frameStyle = _.extend({}, options.styles, {
      position: 'relative',
      width: `${parseInt(width) + BOX_SHADOW_SIZE*2}px`,
    });
    const containerStyle = {
      width,
      margin: `${BOX_SHADOW_SIZE}px`
    };

    const component = (
      <Provider store={store}>
        <PreviewContainer
          store={store}
          frameStyle={frameStyle}
          containerStyle={containerStyle}
          ref={(el) => { if (el) previewContainer = el.getWrappedInstance(); }} />
      </Provider>
    );

    const container = document.createElement('div');

    options.element.appendChild(container);
    ReactDOM.render(component, container);

    setColor();
    store.dispatch({ type: PREVIEWER_LOADED });
  };

  i18n.init(store);
  i18n.setLocale(options.locale, renderComponent);

  return {
    updateScreen,
    updateSettings,
    updateChatState,
    setColor,
    updateLocale,
    waitForComponent
  };
};

window.zEPreview = { renderPreview };
