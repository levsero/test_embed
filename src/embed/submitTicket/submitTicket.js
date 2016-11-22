import React from 'react';
import ReactDOM from 'react-dom';
import _ from 'lodash';

import { document,
         getDocumentHost } from 'utility/globals';
import { SubmitTicket } from 'component/submitTicket/SubmitTicket';
import { frameFactory } from 'embed/frameFactory';
import { getZoomSizingRatio,
         isIE,
         isMobileBrowser,
         setScaleLock } from 'utility/devices';
import { beacon } from 'service/beacon';
import { transitionFactory } from 'service/transitionFactory';
import { mediator } from 'service/mediator';
import { settings } from 'service/settings';
import { generateUserCSS } from 'utility/color';
import { transport } from 'service/transport';

const submitTicketCSS = require('./submitTicket.scss').toString();
let submitTickets = {};
let backButtonSetByHelpCenter = false;

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
    ticketForms: [],
    color: '#659700'
  };
  const attachmentsSetting = settings.get('contactForm.attachments');
  const showBackButton = (show = true) => {
    get(name).instance.getChild().showBackButton(show);
  };

  config = _.extend(configDefaults, config);

  if (attachmentsSetting === false) {
    config.attachmentsEnabled = false;
  }

  const ticketEndpointPath = '/api/v2/requests';
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
  const createUserActionPayload = (payload, params) => {
    const body = params.res.body;
    const response = body.request || body.suspended_ticket;

    return _.extend({}, payload, {
      ticketId: response.id,
      email: params.email,
      attachmentsCount: params.attachmentsCount,
      attachmentTypes: params.attachmentTypes
    });
  };
  const onSubmitted = (params) => {
    let userActionPayload = {
      query: params.searchTerm,
      locale: params.searchLocale
    };

    userActionPayload = createUserActionPayload(userActionPayload, params);

    beacon.trackUserAction('submitTicket', 'send', name, userActionPayload);
    mediator.channel.broadcast(name + '.onFormSubmitted');
  };
  const onCancel = function() {
    mediator.channel.broadcast(name + '.onCancelClick');
  };
  const onShow = (frame) => {
    const rootComponent = frame.getRootComponent();

    if (rootComponent) {
      const { submitTicketForm } = rootComponent.refs;

      if (isMobileBrowser()) {
        setScaleLock(true);
        setTimeout(() => {
          mediator.channel.broadcast('.updateZoom', getZoomSizingRatio());
        }, 0);
      } else {
        if (submitTicketForm) {
          submitTicketForm.focusField();
        }
      }
      if (submitTicketForm) {
        submitTicketForm.resetTicketFormVisibility();
      }
    }
  };

  if (isMobileBrowser()) {
    containerStyle = { width: '100%', height: '100%' };
  } else {
    const margin = settings.get('margin');

    frameStyle = _.extend({}, frameStyle, {
      width: 342,
      marginLeft: margin,
      marginRight: margin
    });
    containerStyle = { width: 342 };
  }

  const settingTicketForms = settings.get('contactForm.ticketForms');
  const ticketForms = _.isEmpty(settingTicketForms)
                    ? config.ticketForms
                    : settingTicketForms;

  if (!_.isEmpty(ticketForms)) {
    const ticketFormIds = ticketForms.join();

    transport.get({
      method: 'get',
      path: `/api/v2/ticket_forms/show_many.json?ids=${ticketFormIds}&include=ticket_fields`,
      callbacks: {
        done(res) {
          waitForRootComponent(name, function() {
            getRootComponent(name).updateTicketForms(JSON.parse(res.text));
          });
        }
      }
    });
  }

  const Embed = frameFactory(
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
          showBackButton={showBackButton}
          attachmentsEnabled={config.attachmentsEnabled}
          subjectEnabled={settings.get('contactForm.subject')}
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
        upClose: transitionFactory.webWidget.upHide(),
        downClose: transitionFactory.webWidget.downHide(),
        close: transitionFactory.webWidget.downHide(),
        downShow: transitionFactory.webWidget.downShow(),
        downHide: transitionFactory.webWidget.downHide(),
        upShow: transitionFactory.webWidget.upShow()
      },
      onShow,
      name: name,
      afterShowAnimate(frame) {
        const rootComponent = frame.getRootComponent();

        if (rootComponent && isIE()) {
          if (rootComponent.refs.submitTicketForm) {
            rootComponent.refs.submitTicketForm.focusField();
          }
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
        if (getRootComponent(name).state.selectedTicketForm) {
          showBackButton(backButtonSetByHelpCenter);
          getRootComponent(name).clearForm();
        } else {
          mediator.channel.broadcast(name + '.onBackClick');
        }
      },
      extend: {}
    });

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
    waitForRootComponent(name, () => {
      if (isMobileBrowser() || !_.isEmpty(getRootComponent(name).state.ticketForms)) {
        get(name).instance.getChild().showBackButton();
        backButtonSetByHelpCenter = true;
      }
    });
  });

  mediator.channel.subscribe(name + '.setLastSearch', function(params) {
    waitForRootComponent(name, () => {
      getRootComponent(name).setState(_.pick(params, ['searchTerm', 'searchLocale']));
    });
  });

  mediator.channel.subscribe(name + '.refreshLocale', () => {
    waitForRootComponent(name, () => {
      getRootComponent(name).forceUpdate();
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
