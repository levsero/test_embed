/** @jsx React.DOM */

module React from 'react'; /* jshint ignore:line */
import { Frame        } from 'component/Frame';
import { SubmitTicket } from 'component/SubmitTicket';
import { Modal        } from 'component/Modal';

var submitTicketCSS = require('./submitTicket.scss'),
    submitTicket = this,
    submitTickets = {};

function create(name) {
  var base = {
        border: 'solid',
        height: '600px',
        width: '700px',
        position: 'fixed',
        top: '50%',
        left: '50%',
        margin: '-300px 0px 0px -350px',
        background: 'white'
      };

  var requestClose = function() {
    submitTicket.hide(name);
  };

  submitTickets[name] = {
    component: (
      /* jshint quotmark:false */
        <Modal onRequestClose={requestClose}>
          <Frame style={base} css={submitTicketCSS}>
            <SubmitTicket />
          </Frame>
        </Modal>
    )
  };
  return this;
}

function render(name) {
  var element = document.body.appendChild(document.createElement('div'));
  React.renderComponent(submitTickets[name].component, element);
}

function show(name) {
  submitTickets[name].component.setState({show: true});
}

function hide(name) {
  submitTickets[name].component.setState({show: false});
}

function get(name) {
  return submitTickets[name];
}

function toggleVisibility(name) {
  var component = submitTickets[name].component;
  component.setState({show: !component.state.show});
}

export var submitTicket = {
  show: show,
  get: get,
  hide: hide,
  toggleVisibility: toggleVisibility,
  create: create,
  render: render
};

