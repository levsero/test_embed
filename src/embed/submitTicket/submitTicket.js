import React from 'react/addons';

import { document,
         getDocumentHost }   from 'utility/globals';
import { SubmitTicket }      from 'component/SubmitTicket';
import { frameFactory }      from 'embed/frameFactory';
import { isMobileBrowser,
         isIE }              from 'utility/devices';
import { beacon }            from 'service/beacon';
import { mediator }          from 'service/mediator';
import { setScaleLock,
         generateUserCSS }   from 'utility/utils';

const submitTicketCSS = require('./submitTicket.scss');
let submitTickets = {};

function create(name, config) {
  let containerStyle,
      posObj;

  const frameStyle = {
    position: 'fixed',
    bottom: 0
  };
  const configDefaults = {
    position: 'right',
    customFields: [],
    hideZendeskLogo: false
  };
  const onSubmitted = function(params) {
    let ticketIdMatcher = /Request \#([0-9]+)/;
    beacon.track(
      'submitTicket',
      'send',
      name,
      {
        query: params.searchString,
        ticketId: parseInt(ticketIdMatcher.exec(params.res.body.message)[1], 10),
        locale: params.searchLocale
      }
    );
    mediator.channel.broadcast(name + '.onFormSubmitted');
  };
  const onCancel = function() {
    mediator.channel.broadcast(name + '.onCancelClick');
  };

  config = _.extend(configDefaults, config);

  /* jshint laxbreak: true */
  if (isMobileBrowser()) {
    containerStyle = { width: '100%', height: '100%' };
  } else {
    posObj = (config.position === 'left')
           ? { left:  0 }
           : { right: 0 };
    frameStyle.width = 342;
    containerStyle = { width: 342, margin: 15 };
  }

  let Embed = React.createClass(frameFactory(
    (params) => {
      return (
        <SubmitTicket
          ref='rootComponent'
          customFields={config.customFields}
          hideZendeskLogo={config.hideZendeskLogo}
          onCancel={onCancel}
          onSubmitted={onSubmitted}
          position={config.position}
          style={containerStyle}
          updateFrameSize={params.updateFrameSize} />
      );
    },
    {
      frameStyle: _.extend(frameStyle, posObj),
      css: submitTicketCSS + generateUserCSS({color: config.color}),
      fullscreenable: true,
      onShow(frame) {
        if (isMobileBrowser()) {
          setScaleLock(true);
        }
        frame.getRootComponent().refs.submitTicketForm.resetTicketFormVisibility();
        if (!isMobileBrowser()) {
          frame.getRootComponent().refs.submitTicketForm.focusField();
        }
      },
      name: name,
      afterShowAnimate(frame) {
        if (isIE()) {
          frame.getRootComponent().refs.submitTicketForm.focusField();
        }
      },
      onHide(frame) {
        if (isMobileBrowser()) {
          setScaleLock(false);
          frame.getRootComponent().refs.submitTicketForm.hideVirtualKeyboard();
        }
        frame.getRootComponent().clearNotification();
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

  submitTickets[name].instance = React.render(submitTickets[name].component, element);

  mediator.channel.subscribe(name + '.show', function() {
    submitTickets[name].instance.show();
  });

  mediator.channel.subscribe(name + '.showWithAnimation', function() {
    submitTickets[name].instance.show(true);
  });

  mediator.channel.subscribe(name + '.hide', function() {
    const submitTicket = getRootComponent(name);

    submitTickets[name].instance.hide();

    if (submitTicket.state.showNotification) {
      submitTicket.clearNotification();
    }
  });

  mediator.channel.subscribe(name + '.showBackButton', function() {
    get(name).instance.getChild().setState({
      showBackButton: true
    });
  });

  mediator.channel.subscribe(name + '.setLastSearch', function(params) {
    getRootComponent(name)
      .setState(_.pick(params, ['searchString', 'searchLocale']));
  });

  mediator.channel.subscribe(name + '.prefill', function(user) {
    prefillForm(name, user);
  });
}

function prefillForm(name, user) {
  const instance = get(name).instance;

  if (instance.getChild()) {
    const submitTicketForm = instance.getRootComponent().refs.submitTicketForm;
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

export var submitTicket = {
  create: create,
  render: render,
  get: get,
  list: list
};

