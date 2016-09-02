import React from 'react';
import ReactDOM from 'react-dom';
import _ from 'lodash';

import { SubmitTicket } from 'component/submitTicket/SubmitTicket';
import { frameFactory } from 'embed/frameFactory';
import { i18n } from 'service/i18n';

const submitTicketCSS = require('embed/submitTicket/submitTicket.scss');

const defaultOptions = {
  locale: 'en-US',
  color: '#659700',
  titleOption: 0
};

const renderWebWidgetPreview = (options) => {
  /* eslint-disable no-unused-vars */
  options = _.defaults({}, options, defaultOptions);

  if (!options.element) {
    throw new Error('A DOM element is required to render the Web Widget Preview into.');
  }

  i18n.setLocale(options.locale);

  let preview;
  const frameStyle = {
    position: 'relative',
    float: 'right',
    width: 342,
    'margin': '15px'
  };
  const containerStyle = {
    width: frameStyle.width
  };
  const frameParams = {
    css: submitTicketCSS,
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
    (params) => {
      return (
        <SubmitTicket
          ref="rootComponent"
          previewEnabled={true}
          formTitleKey={'message'}
          submitTicketSender={submitTicketSender}
          attachmentSender={() => {}}
          style={containerStyle} />
      );
    },
    frameParams
  ));

  preview = ReactDOM.render(<Embed />, options.element);

  const setColor = (color = defaultOptions.color) => {

  };

  const setTitle = (titleOption = defaultOptions.titleOption) => {

  };
  /* eslint-enable no-unused-vars */

  preview.updateFrameSize();

  return {
    setColor,
    setTitle
  };
};

window.zE = _.extend(window.zE, { renderWebWidgetPreview });
