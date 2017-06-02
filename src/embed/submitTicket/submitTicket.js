import ReactDOM from 'react-dom';
import React from 'react';
import _ from 'lodash';

import { submitTicketStyles } from './submitTicketStyles.js';
import { document,
         getDocumentHost } from 'utility/globals';
import { SubmitTicket } from 'component/submitTicket/SubmitTicket';
import { frameFactory } from 'embed/frameFactory';
import { getZoomSizingRatio,
         isIE,
         isMobileBrowser,
         setScaleLock } from 'utility/devices';
import { beacon } from 'service/beacon';
import { i18n } from 'service/i18n';
import { transitionFactory } from 'service/transitionFactory';
import { mediator } from 'service/mediator';
import { settings } from 'service/settings';
import { generateUserCSS } from 'utility/color';
import { transport } from 'service/transport';

const submitTicketCSS = `${require('./submitTicket.scss')} ${submitTicketStyles}`;
let submitTickets = {};
let backButtonSetByHelpCenter = false;

const getTicketForms = _.memoize((config) => {
  const settingTicketForms = settings.get('contactForm.ticketForms');

  if (_.isEmpty(settingTicketForms)) {
    return config.ticketForms;
  }

  return _.chain(settingTicketForms)
          .map((ticketForm) => ticketForm.id)
          .compact()
          .value();
});

const getWithSpinner = (name, path, locale, doneFn) => {
  const transportData = {
    method: 'get',
    path,
    timeout: 20000,
    locale,
    callbacks: {
      done(res) { doneFn(JSON.parse(res.text)); },
      fail() { getRootComponent(name).setLoading(false); }
    }
  };

  waitForRootComponent(name, () => {
    getRootComponent(name).setLoading(true);

    // For setTimeout and invocation of waitForRootComponent,
    // defer and wait for rootComponent before processing statements
    // in order execute after setLoading is completed
    setTimeout(() => {
      transport.get(transportData, false);
    }, 0);
  });
};

function create(name, config, reduxStore) {
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
    disableAutoComplete: false,
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

  let { customFields } = config;
  const ticketForms = getTicketForms(config);
  const locale = i18n.getLocale();

  if (!_.isEmpty(ticketForms)) {
    submitTicket.loadTicketForms(name, ticketForms, locale);
  } else if (customFields.ids || customFields.all) {
    submitTicket.loadTicketFields(name, customFields, locale);
    customFields = [];
  } else {
    setTimeout(() => {
      waitForRootComponent(name, () => {
        getRootComponent(name).updateContactForm();
      });
    }, 0);
  }

  const Embed = frameFactory(
    (params) => {
      return (
        <SubmitTicket
          ref='rootComponent'
          attachmentsEnabled={config.attachmentsEnabled}
          attachmentSender={attachmentSender}
          customFields={customFields}
          disableAutoComplete={config.disableAutoComplete}
          formTitleKey={config.formTitleKey}
          hideZendeskLogo={config.hideZendeskLogo}
          maxFileCount={config.maxFileCount}
          maxFileSize={config.maxFileSize}
          onCancel={onCancel}
          onSubmitted={onSubmitted}
          position={config.position}
          showBackButton={showBackButton}
          style={containerStyle}
          subjectEnabled={settings.get('contactForm.subject')}
          submitTicketSender={submitTicketSender}
          ticketFormSettings={settings.get('contactForm.ticketForms')}
          ticketFieldSettings={settings.get('contactForm.fields')}
          updateFrameSize={params.updateFrameSize}
          tags={settings.get('contactForm.tags')}
          viaId={settings.get('viaId')} />
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
            if (rootComponent.refs.submitTicketForm) {
              rootComponent.refs.submitTicketForm.hideVirtualKeyboard();
            }
          }
          rootComponent.clearNotification();
        }
      },
      onClose() {
        mediator.channel.broadcast(name + '.onClose');
      },
      onBack() {
        const { selectedTicketForm, ticketForms } = getRootComponent(name).state;
        const ticketFormsList = ticketForms && ticketForms.ticket_forms || [];

        if (!selectedTicketForm || ticketFormsList.length === 1) {
          mediator.channel.broadcast(name + '.onBackClick');
        } else {
          showBackButton(backButtonSetByHelpCenter);
          getRootComponent(name).clearForm();
        }
      },
      extend: {}
    },
    reduxStore
  );

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
      const embed = get(name);
      const { config } = embed;
      const ticketForms = getTicketForms(config);

      embed.instance.updateFrameLocale();

      if (!_.isEmpty(ticketForms)) {
        submitTicket.loadTicketForms(name, ticketForms, i18n.getLocale());
      } else if (config.customFields.ids || config.customFields.all) {
        submitTicket.loadTicketFields(name, config.customFields, i18n.getLocale());
      }

      embed.instance.getChild().forceUpdate();
    });
  });

  mediator.channel.subscribe(name + '.prefill', function(user) {
    prefillForm(name, user);
  });

  mediator.channel.subscribe(name + '.update', function() {
    submitTickets[name].instance.getChild().forceUpdate();
  });
}

function loadTicketForms(name, ticketForms, locale) {
  const ticketFormIds = _.toString(ticketForms);
  const onDone = (res) => getRootComponent(name).updateTicketForms(res);
  const path = `/api/v2/ticket_forms/show_many.json?ids=${ticketFormIds}&include=ticket_fields`;

  getWithSpinner(name, path, locale, onDone);
}

function loadTicketFields(name, customFields, locale) {
  const onDone = (res) => getRootComponent(name).updateTicketFields(res);
  const pathIds = customFields.all ? '' : `field_ids=${_.toString(customFields.ids)}&`;
  const path = `/embeddable/ticket_fields?${pathIds}locale=${locale}`;

  getWithSpinner(name, path, locale, onDone);
}

function prefillForm(name, user) {
  waitForRootComponent(name, function() {
    const submitTicket = getRootComponent(name);

    const formData = _.pickBy(_.pick(user, ['name', 'email']), _.isString);

    submitTicket.setState({
      formState: _.extend({}, submitTicket.state.formState, formData)
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
  if (get(name) && get(name).instance && getRootComponent(name)) {
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
  list: list,

  // Exported for testing.
  loadTicketForms,
  loadTicketFields,
  waitForRootComponent
};
