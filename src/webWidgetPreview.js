import React from 'react';
import ReactDOM from 'react-dom';
import _ from 'lodash';

import { Container } from 'component/container/Container';
import { SubmitTicket } from 'component/submitTicket/SubmitTicket';
import { frameFactory } from 'embed/frameFactory';
import { i18n } from 'service/i18n';

import createStore from 'src/redux/createStore';

import { webWidgetStyles } from 'embed/webWidget/webWidgetStyles.js';

const defaultOptions = {
  locale: 'en-US',
  color: '#659700',
  titleKey: 'message',
  styles: {
    float: 'right',
    width: 342,
    marginTop: '16px',
    marginRight: '16px'
  }
};

const renderWebWidgetPreview = (options) => {
  options = _.defaultsDeep({}, options, defaultOptions);

  if (!options.element) {
    throw new Error('A DOM element is required to render the Web Widget Preview into.');
  }

  i18n.setLocale(options.locale);

  let preview;
  const frameStyle = _.extend({}, options.styles, {
    position: 'relative'
  });
  const containerStyle = {
    width: frameStyle.width
  };
  const frameParams = {
    css: `${require('embed/webWidget/webWidget.scss')} ${webWidgetStyles}`,
    name: 'webWidgetPreview',
    frameStyle,
    disableOffsetHorizontal: true,
    preventClose: true
  };

  const Embed = frameFactory(
    () => {
      return (
        <Container
          ref="rootComponent"
          style={containerStyle}>
          <SubmitTicket
            previewEnabled={true}
            formTitleKey={options.titleKey}
            submitTicketSender={() => {}}
            attachmentSender={() => {}}
            style={containerStyle} />
        </Container>
      );
    },
    frameParams,
    createStore()
  );

  const container = document.createElement('div');

  options.element.appendChild(container);
  preview = ReactDOM.render(<Embed />, container);

  const setColor = (color = defaultOptions.color) => {
    preview.setButtonColor(color);
  };

  const setTitle = (titleKey = defaultOptions.titleKey) => {
    waitForRootComponent(preview, (rootComponent) => {
      rootComponent.setFormTitleKey(titleKey);
    });
  };

  waitForRootComponent(preview, () => {
    preview.updateFrameSize();
    setColor(options.color);
  });

  return {
    setColor,
    setTitle
  };
};

const getRootComponent = (preview) => {
  return preview.getRootComponent();
};

const waitForRootComponent = (preview, callback) => {
  const rootComponent = getRootComponent(preview);

  if (rootComponent) {
    callback(rootComponent);
  } else {
    setTimeout(() => waitForRootComponent(preview, callback), 0);
  }
};

window.zE = _.extend(window.zE, { renderWebWidgetPreview });
