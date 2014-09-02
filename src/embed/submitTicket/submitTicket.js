/** @jsx React.DOM */

module React from 'react/addons';

import { document }        from 'utility/globals';
import { SubmitTicket }    from 'component/SubmitTicket';
import { frameFactory }    from 'embed/frameFactory';
import { setScaleLock }    from 'utility/utils';
import { isMobileBrowser } from 'utility/devices';

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
      Embed,
      handleBack = function() {
        config.goBack();
        transition(name);
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
            handleBack = {handleBack}/>
        </div>
      );
    },
    {
      style: iframeStyle,
      css: submitTicketCSS,
      fullscreenable: true,
      onShow() {
        setScaleLock(true);
        config.onShow();
      },
      onHide() {
        setScaleLock(false);
        config.onHide();
      },
      onClose() {
        update(name, true);
      },
      extend: {}
    }));

  submitTickets[name] = {
    component: <Embed visible={false} />
  };

  return this;
}

function render(name) {
  if (submitTickets[name] && submitTickets[name].instance) {
    throw new Error(`SubmitTicket ${name} has already been rendered.`);
  }

  var element = document.body.appendChild(document.createElement('div'));
  submitTickets[name].instance = React.renderComponent(submitTickets[name].component, element);
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
  get(name).instance.reset();
}

function transition(name) {
  get(name).instance.transition();
}

function update(name, isVisible) {
  var submitTicket = get(name).instance.getChild().refs.submitTicket,
      isSuccessState = submitTicket.state.showNotification;

  if (isVisible) {
    hide(name);

    if (isSuccessState) {
      submitTicket.reset();
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
  transition: transition
};

