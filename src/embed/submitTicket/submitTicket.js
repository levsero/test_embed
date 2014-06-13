/** @jsx React.DOM */

module React from 'react'; /* jshint ignore:line */
import { document     } from 'util/globals';
import { Frame        } from 'component/Frame';
import { SubmitTicket } from 'component/SubmitTicket';

var submitTicketCSS = require('./submitTicket.scss'),
    submitTickets = {};

function create(name, config) {
  var base = {
        minHeight: '320px',
        borderRadius: '10px 10px 0 0',
        boxShadow: '1px 1px 5px rgba(0,0,0,0.5)',
        width: '320px',
        position: 'fixed',
        bottom: 0,
        background: 'white'
      },
      configDefaults = {
        position: 'right'
      },
      Wrapper,
      posObj,
      iframeStyle;

  config = _.extend(configDefaults, config);

  /* jshint laxbreak: true */
  posObj = (config.position === 'left')
         ? { 'left':  '20px' }
         : { 'right': '20px' };

  iframeStyle = _.extend(base, posObj);

  Wrapper = React.createClass({
    hide: function() {
      this.props.onHide();
      this.refs.frame.hide();
    },
    show: function() {
      this.props.onShow();
      this.refs.frame.show();
    },
    toggleVisibility: function() {
      this.refs.frame.toggleVisibility();
    },
    render: function() {
      return (
        /* jshint quotmark: false */
        <Frame ref='frame'
          visibility={false}
          closable={true}
          style={iframeStyle}
          css={submitTicketCSS}>
          <SubmitTicket ref='submitTicket' />
        </Frame>
      );
    }
  });

  submitTickets[name] = {
    component: <Wrapper onShow={config.onShow} onHide={config.onHide} />
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
  if (get(name).instance.refs.submitTicket.state.showNotification) {
    reset(name);
  }
}

function toggleVisibility(name) {
  get(name).instance.toggleVisibility();
  if (get(name).instance.refs.submitTicket.state.showNotification) {
    reset(name);
  }
}

function reset(name) {
  // TODO add new way to reset the form
  return name;
}

export var submitTicket = {
  create: create,
  render: render,
  get: get,
  list: list,
  show: show,
  hide: hide,
  toggleVisibility: toggleVisibility,
  reset: reset,
  getFormComponent: getFormComponent
};

