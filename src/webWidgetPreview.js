import React from 'react';
import ReactDOM from 'react-dom';
import _ from 'lodash';

import { SubmitTicket } from 'component/submitTicket/SubmitTicket';
import { frameFactory } from 'embed/frameFactory';
import { i18n } from 'service/i18n';
import { generateUserCSS } from 'utility/color';

const submitTicketCSS = require('embed/submitTicket/submitTicket.scss');

const defaultOptions = {
  locale: 'en-US',
  color: '#659700',
  titleKey: 'message',
  styles: {
    width: 342,
    margin: '16px'
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
    position: 'relative',
    float: 'right'
  });
  const containerStyle = {
    width: frameStyle.width
  };
  const frameParams = {
    css: submitTicketCSS + generateUserCSS(options.color),
    name: 'webWidgetPreview',
    frameStyle,
    position: 'right',
    disableOffsetHorizontal: true,
    preventClose: true
  };

  const submitTicketSender = (params, done) => {
    setTimeout(() => {
      done();
    }, 1500);
  };

  const Embed = React.createClass(frameFactory(
    () => {
      return (
        <SubmitTicket
          ref="rootComponent"
          previewEnabled={true}
          formTitleKey={options.titleKey}
          submitTicketSender={submitTicketSender}
          attachmentSender={() => {}}
          style={containerStyle} />
      );
    },
    frameParams
  ));

  preview = ReactDOM.render(<Embed />, options.element);

  const setColor = (color = defaultOptions.color) => {
    preview.setButtonColor(color);
  };

  const setTitle = (titleKey = defaultOptions.titleKey) => {
    waitForRootComponent(preview, (rootComponent) => {
      rootComponent.setFormTitleKey(titleKey);
    });
  };

  preview.updateFrameSize();

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
