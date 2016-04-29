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
    formTitleKey: 'message'
  };
  const submitTicketSender = (params, doneFn, failFn) => {
    const payload = {
      method: 'post',
      path: '/requests/embedded/create',
      params: params,
      callbacks: {
        done: doneFn,
        fail: failFn
      }
    };

    transport.send(payload);
  };
  const onSubmitted = function(params) {
    let ticketIdMatcher = /Request \#([0-9]+)/;

    beacon.trackUserAction({
      category: 'submitTicket',
      action: 'send',
      name: name,
      value: {
        query: params.searchString,
        locale: params.searchLocale,
        ticketId: parseInt(ticketIdMatcher.exec(params.res.body.message)[1], 10),
        email: params.res.req._data.email
      }
    });
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

  config = _.extend(configDefaults, config);

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
          onSubmitted={onSubmitted}
          position={config.position}
          formTitleKey={config.formTitleKey}
          style={containerStyle}
          updateFrameSize={params.updateFrameSize} />
      );
    },
    {
      frameStyle: frameStyle,
      css: submitTicketCSS + generateUserCSS({color: config.color}),
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
    if (getRootComponent(name)) {
      submitTickets[name].instance.show(options);
    }
  });

  mediator.channel.subscribe(name + '.hide', function(options = {}) {
    const rootComponent = getRootComponent(name);

    if (rootComponent) {
      submitTickets[name].instance.hide(options);

      if (rootComponent.state.showNotification) {
        rootComponent.clearNotification();
      }
    }
  });

  mediator.channel.subscribe(name + '.showBackButton', function() {
    get(name).instance.getChild().setState({ showBackButton: true });
  });

  mediator.channel.subscribe(name + '.setLastSearch', function(params) {
    const rootComponent = getRootComponent(name);

    if (rootComponent) {
      rootComponent.setState(_.pick(params, ['searchString', 'searchLocale']));
    }
  });

  mediator.channel.subscribe(name + '.prefill', function(user) {
    prefillForm(name, user);
  });

  mediator.channel.subscribe(name + '.update', function() {
    submitTickets[name].instance.getChild().forceUpdate();
  });
}

function prefillForm(name, user) {
  const rootComponent = getRootComponent(name);

  if (rootComponent) {
    const submitTicketForm = rootComponent.refs.submitTicketForm;

    submitTicketForm.setState({
      formState: _.pick(user, ['name', 'email'])
    });
  } else {
    setTimeout(() => {
      prefillForm(name, user);
    }, 0);
  }
}

function get(name) {
  return submitTickets[name];
}

function getRootComponent(name) {
  return get(name).instance.getRootComponent();
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
