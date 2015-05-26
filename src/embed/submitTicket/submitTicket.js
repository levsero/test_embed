import React from 'react/addons';

import { document,
         getDocumentHost } from 'utility/globals';
import { SubmitTicket }    from 'component/SubmitTicket';
import { frameFactory }    from 'embed/frameFactory';
import { setScaleLock }    from 'utility/utils';
import { isMobileBrowser,
         isIE }            from 'utility/devices';
import { beacon }          from 'service/beacon';
import { mediator }        from 'service/mediator';
import { generateUserCSS } from 'utility/utils';

var submitTicketCSS = require('./submitTicket.scss'),
    submitTickets = {};

function create(name, config) {
  var containerStyle,
      iframeBase = {
        position: 'fixed',
        bottom: 50
      },
      configDefaults = {
        position: 'right',
        customFields: [],
        hideZendeskLogo: false
      },
      posObj,
      iframeStyle,
      onSubmitted = function() {
        beacon.track('submitTicket', 'send', name);
        mediator.channel.broadcast(name + '.onFormSubmitted');
      },
      Embed;

  config = _.extend(configDefaults, config);

  /* jshint laxbreak: true */
  if (isMobileBrowser()) {
    containerStyle = { width: '100%', height: '100%' };
  } else {
    posObj = (config.position === 'left')
           ? { left:  5 }
           : { right: 5 };
    iframeBase.minWidth = 400;
    containerStyle = { minWidth: 400, margin: 15 };
  }

  iframeStyle = _.extend(iframeBase, posObj);

  Embed = React.createClass(frameFactory(
    (params) => {
      /* jshint quotmark:false */
      return (
        <div style={containerStyle}>
          <SubmitTicket
            ref='submitTicket'
            updateFrameSize={params.updateFrameSize}
            onSubmitted={onSubmitted}
            customFields={config.customFields}
            hideZendeskLogo={config.hideZendeskLogo}
            position={config.position}/>
        </div>
      );
    },
    {
      style: iframeStyle,
      css: submitTicketCSS + generateUserCSS({color: config.color}),
      fullscreenable: true,
      onShow(child) {
        if (isMobileBrowser()) {
          setScaleLock(true);
        }
        child.refs.submitTicket.refs.submitTicketForm.resetTicketFormVisibility();
        child.refs.submitTicket.refs.submitTicketForm.focusField();
      },
      name: name,
      afterShowAnimate(child) {
        if (isIE()) {
          child.refs.submitTicket.refs.submitTicketForm.focusField();
        }
      },
      onHide(child) {
        if (isMobileBrowser()) {
          setScaleLock(false);
          child.refs.submitTicket.refs.submitTicketForm.hideVirtualKeyboard();
        }
        child.refs.submitTicket.clearNotification();
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

  var element = getDocumentHost().appendChild(document.createElement('div'));

  submitTickets[name].instance = React.render(submitTickets[name].component, element);

  mediator.channel.subscribe(name + '.show', function() {
    submitTickets[name].instance.show();
  });

  mediator.channel.subscribe(name + '.showWithAnimation', function() {
    submitTickets[name].instance.show(true);
  });

  mediator.channel.subscribe(name + '.hide', function() {
    var submitTicket = get(name).instance.getChild().refs.submitTicket;

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

  mediator.channel.subscribe('.identify', function(user) {
    prefillForm(name, user);
  });
}

function prefillForm(name, user) {
  var getChild = get(name).instance.getChild();

  if(getChild) {
    var submitTicket = get(name).instance.getChild().refs.submitTicket,
        submitTicketForm = submitTicket.refs.submitTicketForm;

    submitTicketForm.refs.form.updateValue(user);
  } else {
    setTimeout(() => {
      prefillForm(name, user);
    }, 0);
  }
}

function get(name) {
  return submitTickets[name];
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

