/** @jsx React.DOM */

module React from 'react/addons';

import { document }        from 'utility/globals';
import { SubmitTicket }    from 'component/SubmitTicket';
import { frameFactory }    from 'embed/frameFactory';
import { setScaleLock }    from 'utility/utils';
import { isMobileBrowser } from 'utility/devices';
import { beacon }          from 'service/beacon';
import { mediator }        from 'service/mediator';

var submitTicketCSS = require('./submitTicket.scss'),
    submitTickets = {};

function create(name, config) {
  var containerStyle,
      iframeBase = {
        position: 'fixed',
        bottom: 48
      },
      configDefaults = {
        position: 'right'
      },
      posObj,
      iframeStyle,
      onSubmit = function() {
        beacon.track('submitTicket', 'send', name);
      },
      Embed,
      handleBack = function() {
        config.goBack();
        toggleVisibility(name);
      };

  config = _.extend(configDefaults, config);

  /* jshint laxbreak: true */
  if (isMobileBrowser()) {
    containerStyle = { width: '100%', height: '100%' };
  } else {
    posObj = (config.position === 'left')
           ? { left:  5 }
           : { right: 5 };
    iframeBase.minWidth = 350;
    containerStyle = { minWidth: 350, margin: 15 };
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
            onSubmit={onSubmit}
            handleBack={handleBack}/>
        </div>
      );
    },
    {
      style: iframeStyle,
      css: submitTicketCSS,
      fullscreenable: true,
      onShow() {
        setScaleLock(true);
        //config.onShow();
      },
      onHide() {
        setScaleLock(false);
        //config.onHide();
      },
      onClose() {
        update(name, true);
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

  var element = document.body.appendChild(document.createElement('div'));
  submitTickets[name].instance = React.renderComponent(submitTickets[name].component, element);

  mediator.channel.subscribe(name + '.show', function() {
    show(name);
  });

  mediator.channel.subscribe(name + '.hide', function() {
    hide(name);
  });
}

function get(name) {
  return submitTickets[name];
}

function list() {
  return submitTickets;
}

function show(name) {
  get(name).instance.show();
}

function hide(name) {
  get(name).instance.hide();
}

function reset(name) {
  var config = get(name).config,
      submitTicket = get(name).instance.getChild().refs.submitTicket,
      submitTicketForm = submitTicket.refs.submitTicketForm;

  if (submitTicketForm.state.showBackButton) {
    config.goBack(false);
  }
  submitTicket.reset();
}

function toggleVisibility(name) {
  var submitTicket = get(name).instance,
      submitTicketForm = submitTicket.getChild().refs.submitTicket.refs.submitTicketForm;

  submitTicket.toggleVisibility();
  submitTicketForm.setState({
    showBackButton: true
  });
}

function update(name, isVisible) {
  var submitTicket = get(name).instance.getChild().refs.submitTicket,
      isSuccessState = submitTicket.state.showNotification;

  if (isVisible) {
    hide(name);

    if (isSuccessState) {
      reset(name);
    }
  } else {
    show(name);
  }
}

export var submitTicket = {
  create: create,
  render: render,
  get: get,
  list: list,
  show: show,
  hide: hide,
  reset: reset,
  update: update,
  toggleVisibility: toggleVisibility
};

