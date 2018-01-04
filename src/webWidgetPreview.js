import React from 'react';
import ReactDOM from 'react-dom';
import _ from 'lodash';

import { Container } from 'component/container/Container';
import { SubmitTicket } from 'component/submitTicket/SubmitTicket';
import { Frame } from 'component/frame/Frame';
import { i18n } from 'service/i18n';

import createStore from 'src/redux/createStore';

import { webWidgetStyles } from 'embed/webWidget/webWidgetStyles.js';

let submitTicketComponent = null;
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
let preview;

const renderWebWidgetPreview = (options) => {
  options = _.defaultsDeep({}, options, defaultOptions);

  if (!options.element) {
    throw new Error('A DOM element is required to render the Web Widget Preview into.');
  }

  i18n.setLocale(options.locale);

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

  const component = (
    <Frame {...frameParams} store={createStore()}>
      <Container
        style={containerStyle}>
        <SubmitTicket
          ref={(submitTicket) => submitTicketComponent = submitTicket}
          previewEnabled={true}
          formTitleKey={options.titleKey}
          submitTicketSender={() => {}}
          attachmentSender={() => {}}
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

  const setTitle = (titleKey = defaultOptions.titleKey) => {
    waitForSubmitTicketComponent((component) => {
      component.setFormTitleKey(titleKey);
    });
  };

  waitForSubmitTicketComponent(() => {
    preview.updateFrameSize();
    setColor(options.color);
  });

  return {
    setColor,
    setTitle,
    _component: preview
  };
};

const getSubmitTicketComponent = () => {
  return submitTicketComponent;
};

const waitForSubmitTicketComponent = (callback) => {
  const component = getSubmitTicketComponent();

  if (component !== null) {
    callback(component);
  } else {
    setTimeout(() => waitForSubmitTicketComponent(callback), 0);
  }
};

window.zE = _.extend(window.zE, { renderWebWidgetPreview });
