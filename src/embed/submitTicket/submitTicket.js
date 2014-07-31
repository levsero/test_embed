/** @jsx React.DOM */

module React from 'react'; /* jshint ignore:line */
import { document     } from 'util/globals';
import { SubmitTicket } from 'component/SubmitTicket';
import { frameFactory } from 'embed/frameFactory';
import { setScaleLock } from 'util/utils';
import { isMobileBrowser } from 'util/devices';

var submitTicketCSS = require('./submitTicket.scss'),
    submitTickets = {};

function create(name, config) {
  var containerStyle,
      iframeBase = {
        position: 'fixed',
        bottom: 48,
        minWidth: 350
      },
      configDefaults = {
        position: 'right'
      },
      posObj,
      iframeStyle,
      Embed;

  config = _.extend(configDefaults, config);

  /* jshint laxbreak: true */
  if (isMobileBrowser()) {
    posObj = {};
    containerStyle = {};
  } else {
    posObj = (config.position === 'left')
           ? { left:  5 }
           : { right: 5 };
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
            updateFrameSize={params.updateFrameSize} />
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
      extend: {}
    }));

  submitTickets[name] = {
    component: <Embed visible={false} />
  };

  return this;
}

function render(name) {
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

function update(name, isVisible) {
  var submitTicket = get(name).instance.getChild().refs.submitTicket,
      isSuccessState = submitTicket.state.showNotification;

  if(isVisible) {
    hide(name);

    if(isSuccessState) {
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
  update: update
};

