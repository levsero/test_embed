import React from 'react';
import ReactDOM from 'react-dom';
import _ from 'lodash';

import { document,
         getDocumentHost } from 'utility/globals';
import { WebWidget } from 'component/webWidget/WebWidget';
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

import LoadingSpinnerStyles from 'component/loading/LoadingSpinner.sass';
import SubmitTicketStyles from 'component/submitTicket/SubmitTicket.sass';
import SubmitTicketFormStyles from 'component/submitTicket/SubmitTicketForm.sass';

const submitTicketCSS = `
  ${require('../submitTicket/submitTicket.scss')}
  ${LoadingSpinnerStyles}
  ${SubmitTicketStyles}
  ${SubmitTicketFormStyles}
`;
let embed = null;
let backButtonSetByHelpCenter = false;

function create(name, config) {
  let containerStyle;
  let frameStyle = {};

  const configDefaults = {
    position: 'right',
    customFields: [],
    hideZendeskLogo: false,
    formTitleKey: 'message',
    expandable: false,
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

    beacon.trackUserAction('submitTicket', 'send', 'ticketSubmissionForm', userActionPayload);
    mediator.channel.broadcast('ticketSubmissionForm.onFormSubmitted');
  };
  const onCancel = function() {
    mediator.channel.broadcast('ticketSubmissionForm.onCancelClick');
  };
  const onShow = (frame) => {
    const rootComponent = getRootComponent();

    // TODO: Only if root component is submit ticket.
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

    waitForRootComponent(name, () => {
      getRootComponent(name).setLoading(true);
    });

    transport.get({
      method: 'get',
      path: `/api/v2/ticket_forms/show_many.json?ids=${ticketFormIds}&include=ticket_fields`,
      timeout: 20000,
      callbacks: {
        done(res) {
          // do this on next tick so that it never happens before
          // the one above that sets loading to true.
          setTimeout(() => {
            waitForRootComponent(name, () => {
              getRootComponent(name).updateTicketForms(JSON.parse(res.text));
            });
          }, 0);
        },
        fail() {
          // do this on next tick so that it never happens before
          // the one above that sets loading to true.
          setTimeout(() => {
            waitForRootComponent(name, () => {
              getRootComponent(name).setLoading(false);
            });
          }, 0);
        }
      }
    });
  }

  const submitTicketFrameParams = {
    frameStyle: frameStyle,
    css: submitTicketCSS + generateUserCSS(config.color),
    position: config.position,
    fullscreenable: true,
    expandable: config.expandable,
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
    afterShowAnimate() {
      const rootComponent = getRootComponent();

      if (rootComponent && isIE()) {
        if (rootComponent.refs.submitTicketForm) {
          rootComponent.refs.submitTicketForm.focusField();
        }
      }
    },
    onHide() {
      const rootComponent = getRootComponent();

      if (rootComponent) {
        if (isMobileBrowser()) {
          setScaleLock(false);
          rootComponent.refs.submitTicketForm.hideVirtualKeyboard();
        }
        rootComponent.clearNotification();
      }
    },
    onClose() {
      mediator.channel.broadcast('ticketSubmissionForm.onClose');
    },
    onBack() {
      if (getRootComponent(name).state.selectedTicketForm) {
        showBackButton(backButtonSetByHelpCenter);
        getRootComponent(name).clearForm();
      } else {
        mediator.channel.broadcast('ticketSubmissionForm.onBackClick');
      }
    }
  };

  const Embed = frameFactory(
    (params) => {
      return (
        <WebWidget
          ref='rootComponent'
          submitTicketConfig={config}
          onCancel={onCancel}
          submitTicketSender={submitTicketSender}
          attachmentSender={attachmentSender}
          onSubmitted={onSubmitted}
          position={config.position}
          style={containerStyle}
          showBackButton={showBackButton}
          subjectEnabled={settings.get('contactForm.subject')}
          updateFrameSize={params.updateFrameSize} />
      );
    },
    submitTicketFrameParams
  );

  embed = {
    component: <Embed visible={false} />,
    config: config
  };

  return this;
}

function render(name) {
  if (embed && embed.instance) {
    throw new Error(`SubmitTicket ${name} has already been rendered.`);
  }

  const element = getDocumentHost().appendChild(document.createElement('div'));

  embed.instance = ReactDOM.render(embed.component, element);

  mediator.channel.subscribe('ticketSubmissionForm.show', function(options = {}) {
    waitForRootComponent(name, () => {
      embed.instance.show(options);
    });
  });

  mediator.channel.subscribe('ticketSubmissionForm.hide', function(options = {}) {
    waitForRootComponent(name, () => {
      const rootComponent = getRootComponent(name);

      embed.instance.hide(options);

      if (rootComponent.state.showNotification) {
        rootComponent.clearNotification();
      }
    });
  });

  mediator.channel.subscribe('ticketSubmissionForm.showBackButton', function() {
    waitForRootComponent(name, () => {
      if (isMobileBrowser() || !_.isEmpty(getRootComponent(name).state.ticketForms)) {
        get(name).instance.getChild().showBackButton();
        backButtonSetByHelpCenter = true;
      }
    });
  });

  mediator.channel.subscribe('ticketSubmissionForm.setLastSearch', function(params) {
    waitForRootComponent(name, () => {
      getRootComponent(name).setState(_.pick(params, ['searchTerm', 'searchLocale']));
    });
  });

  mediator.channel.subscribe('ticketSubmissionForm.refreshLocale', () => {
    waitForRootComponent(name, () => {
      getRootComponent(name).forceUpdate();
    });
  });

  mediator.channel.subscribe('ticketSubmissionForm.prefill', function(user) {
    prefillForm(name, user);
  });

  mediator.channel.subscribe('ticketSubmissionForm.update', function() {
    embed.instance.getChild().forceUpdate();
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
  return embed;
}

function getRootComponent(name) {
  return get(name).instance.getRootComponent().refs.rootComponent;
}

function waitForRootComponent(name, callback) {
  if (get(name) && get(name).instance && getRootComponent(name)) {
    callback();
  } else {
    setTimeout(() => {
      waitForRootComponent(name, callback);
    }, 0);
  }
}

function list() {
  return { embed };
}

export const webWidget = {
  create: create,
  render: render,
  get: get,
  list: list
};
