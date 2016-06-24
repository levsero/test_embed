import React from 'react';
import ReactDOM from 'react-dom';
import _ from 'lodash';

import { document,
         getDocumentHost } from 'utility/globals';
import { SubmitTicket } from 'component/SubmitTicket';
import { frameFactory } from 'embed/frameFactory';
import { isMobileBrowser,
         isIE } from 'utility/devices';
import { beacon } from 'service/beacon';
import { transitionFactory } from 'service/transitionFactory';
import { mediator } from 'service/mediator';
import { settings } from 'service/settings';
import { setScaleLock,
         generateUserCSS } from 'utility/utils';
import { transport } from 'service/transport';

const submitTicketCSS = require('./submitTicket.scss');
let submitTickets = {};

function create(name, config) {
  let containerStyle;
  let frameStyle = {};

  const configDefaults = {
    position: 'right',
    customFields: [],
    hideZendeskLogo: false,
    formTitleKey: 'message',
    attachmentsEnabled: false,
    maxFileCount: 5,
    maxFileSize: 5 * 1024 * 1024, // 5 MB
    color: '#659700'
  };

  config = _.extend(configDefaults, config);
  const ticketEndpointPath = config.attachmentsEnabled
             ? '/api/v2/requests'
             : '/requests/embedded/create';
  const ticketAttachmentsEndpoint = '/api/v2/uploads';
  const submitTicketSender = (params, doneFn, failFn) => {
    const payload = {
      method: 'post',
      path: ticketEndpointPath,
      params: params,
      callbacks: {
        done: doneFn,
        fail: failFn
      }
    };

    transport.send(payload);
  };
  const attachmentSender = (file, doneFn, failFn, progressFn) => {
    const payload = {
      method: 'post',
      path: ticketAttachmentsEndpoint,
      file: file,
      callbacks: {
        done: doneFn,
        fail: failFn,
        progress: progressFn
      }
    };

    return transport.sendFile(payload);
  };
  const onSubmitted = function(params) {
    let ticketIdMatcher = /Request \#([0-9]+)/;

    beacon.trackUserAction(
      'submitTicket',
      'send',
      name,
      {
        query: params.searchTerm,
        locale: params.searchLocale,
        ticketId: parseInt(ticketIdMatcher.exec(params.res.body.message)[1], 10),
        email: params.res.req._data.email
      }
    );
    mediator.channel.broadcast(name + '.onFormSubmitted');
  };
  const onCancel = function() {
    mediator.channel.broadcast(name + '.onCancelClick');
  };
  const onShow = (frame) => {
    const rootComponent = frame.getRootComponent();

    if (rootComponent) {
      if (isMobileBrowser()) {
        setScaleLock(true);
      } else {
        rootComponent.refs.submitTicketForm.focusField();
      }
      rootComponent.refs.submitTicketForm.resetTicketFormVisibility();
    }
  };

  if (isMobileBrowser()) {
    containerStyle = { width: '100%', height: '100%' };
  } else {
    frameStyle.width = 342;
    containerStyle = { width: 342, margin: settings.get('widgetMargin') };
  }

  let Embed = React.createClass(frameFactory(
    (params) => {
      return (
        <SubmitTicket
          ref='rootComponent'
          customFields={config.customFields}
          hideZendeskLogo={config.hideZendeskLogo}
          onCancel={onCancel}
          submitTicketSender={submitTicketSender}
          attachmentSender={attachmentSender}
          onSubmitted={onSubmitted}
          position={config.position}
          formTitleKey={config.formTitleKey}
          style={containerStyle}
          attachmentsEnabled={config.attachmentsEnabled}
          maxFileCount={config.maxFileCount}
          maxFileSize={config.maxFileSize}
          updateFrameSize={params.updateFrameSize} />
      );
    },
    {
      frameStyle: frameStyle,
      css: submitTicketCSS + generateUserCSS(config.color),
      position: config.position,
      fullscreenable: true,
      transitions: {
        close: transitionFactory.webWidget.downHide(),
        downHide: transitionFactory.webWidget.downHide(),
        downShow: transitionFactory.webWidget.downShow(),
        upShow: transitionFactory.webWidget.upShow()
      },
      onShow,
      name: name,
      afterShowAnimate(frame) {
        const rootComponent = frame.getRootComponent();

        if (rootComponent && isIE()) {
          rootComponent.refs.submitTicketForm.focusField();
        }
      },
      onHide(frame) {
        const rootComponent = frame.getRootComponent();

        if (rootComponent) {
          if (isMobileBrowser()) {
            setScaleLock(false);
            rootComponent.refs.submitTicketForm.hideVirtualKeyboard();
          }
          rootComponent.clearNotification();
        }
      },
      onClose() {
        mediator.channel.broadcast(name + '.onClose');
      },
      onBack() {
        mediator.channel.broadcast(name + '.onBackClick');
      },
      extend: {}
    }));

  submitTickets[name] = {
    component: <Embed visible={false} />,
    config: config
  };

  return this;
}

function render(name) {
  if (submitTickets[name] && submitTickets[name].instance) {
    throw new Error(`SubmitTicket ${name} has already been rendered.`);
  }

  const element = getDocumentHost().appendChild(document.createElement('div'));

  submitTickets[name].instance = ReactDOM.render(submitTickets[name].component, element);

  mediator.channel.subscribe(name + '.show', function(options = {}) {
    waitForRootComponent(name, () => {
      submitTickets[name].instance.show(options);
    });
  });

  mediator.channel.subscribe(name + '.hide', function(options = {}) {
    waitForRootComponent(name, () => {
      const rootComponent = getRootComponent(name);

      submitTickets[name].instance.hide(options);

      if (rootComponent.state.showNotification) {
        rootComponent.clearNotification();
      }
    });
  });

  mediator.channel.subscribe(name + '.showBackButton', function() {
    get(name).instance.getChild().setState({ showBackButton: true });
  });

  mediator.channel.subscribe(name + '.setLastSearch', function(params) {
    waitForRootComponent(name, () => {
      getRootComponent(name).setState(_.pick(params, ['searchTerm', 'searchLocale']));
    });
  });

  mediator.channel.subscribe(name + '.prefill', function(user) {
    prefillForm(name, user);
  });

  mediator.channel.subscribe(name + '.update', function() {
    submitTickets[name].instance.getChild().forceUpdate();
  });
}

function prefillForm(name, user) {
  waitForRootComponent(name, function() {
    const submitTicketForm = getRootComponent(name).refs.submitTicketForm;

    submitTicketForm.setState({
      formState: _.pick(user, ['name', 'email'])
    });
  });
}

function get(name) {
  return submitTickets[name];
}

function getRootComponent(name) {
  return get(name).instance.getRootComponent();
}

function waitForRootComponent(name, callback) {
  if (getRootComponent(name)) {
    callback();
  } else {
    setTimeout(() => {
      waitForRootComponent(name, callback);
    }, 0);
  }
}

function list() {
  return submitTickets;
}

export const submitTicket = {
  create: create,
  render: render,
  get: get,
  list: list
};
