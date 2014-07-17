/** @jsx React.DOM */

module React from 'react'; /* jshint ignore:line */
import { document     } from 'util/globals';
import { SubmitTicket } from 'component/SubmitTicket';
import { frameFactory } from 'embed/frameFactory';

var submitTicketCSS = require('./submitTicket.scss'),
    submitTicketFrameCSS = require('./submitTicketFrame.scss'),
    submitTickets = {};

function create(name, config) {
  var containerBase = {
        minWidth: 320,
        margin: 15
      },
      base = {
        position: 'fixed',
        bottom: 48,
        minWidth: 320
      },
      configDefaults = {
        position: 'right'
      },
      posObj,
      iframeStyle,
      Embed;

  config = _.extend(configDefaults, config);

  /* jshint laxbreak: true */
  posObj = (config.position === 'left')
         ? { left:  5 }
         : { right: 5 };

  iframeStyle = _.extend(base, posObj);

  Embed = React.createClass(frameFactory(
    (params) => {
      /* jshint quotmark:false */
      return (
        <div style={containerBase}>
          <SubmitTicket
            ref='submitTicket'
            updateFrameSize={params.updateFrameSize}
            hide={params.hideHandler} />
        </div>
      );
    },
    {
      style: iframeStyle,
      className: 'SubmitTicketFrame',
      frameCSS: submitTicketFrameCSS,
      css: submitTicketCSS,
      onShow() {
        config.onShow();
      },
      onHide() {
        config.onHide();
      },
      extend: {
        hideHandler() {
          var refs = this.getChild().refs;

          this.hide();
          if (refs.submitTicket.state.showNotification) {
            refs.submitTicket.reset();
          }
        }
      }
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
  if(isVisible) {
    hide(name);
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

