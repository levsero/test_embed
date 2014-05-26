/** @jsx React.DOM */

module React from 'react'; /* jshint ignore:line */
import { document     } from 'util/globals';
import { Frame        } from 'component/Frame';
import { SubmitTicket } from 'component/SubmitTicket';
import { Modal        } from 'component/Modal';

var submitTicketCSS = require('./submitTicket.scss'),
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
      },
      requestClose = function() {
        hide(name);
      };

  submitTickets[name] = {
    component: (
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

function get(name) {
  return submitTickets[name];
}

function show(name) {
  get(name).component.setState({show: true});
}

function hide(name) {
  var component = get(name).component;
  component.setState({show: false});
  if(getFormComponent(name).state.showNotification) {
    reset(name);
  }
}

function toggleVisibility(name) {
  var component = get(name).component;
  component.setState({show: !component.state.show});
  if(getFormComponent(name).state.showNotification === true) {
    reset(name);
  }
}

function reset(name) {
  var component = getFormComponent(name);
  component.replaceState(component.getInitialState());
}

function getFormComponent(name) {
  return get(name).component.props.children.props.children;
}

export var submitTicket = {
  create: create,
  render: render,
  get: get,
  show: show,
  hide: hide,
  toggleVisibility: toggleVisibility
};

