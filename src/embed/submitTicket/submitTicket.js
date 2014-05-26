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
  submitTickets[name].component.setState({show: true});
}

function hide(name) {
  var component = submitTickets[name].component;
  component.setState({show: false});
  if(component.props.children.props.children.state.showNotification === true) {
    reset(name);
  }
}

function toggleVisibility(name) {
  var component = submitTickets[name].component;
  component.setState({show: !component.state.show});
  if(component.props.children.props.children.state.showNotification === true) {
    reset(name);
  }
}

function reset(name) {
  var component = submitTickets[name].component,
      frame = component.props.children,
      submitTicket = frame.props.children,
      refs = submitTicket.refs;

  submitTicket.setState({showNotification: false, message: ''});
  refs.subjectField.setState({value: ''});
  refs.nameField.setState({value: ''});
  refs.emailField.setState({value: ''});
  refs.descriptionField.setState({value: ''});
}

export var submitTicket = {
  create: create,
  render: render,
  get: get,
  show: show,
  hide: hide,
  toggleVisibility: toggleVisibility
};

