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
      /* jshint laxbreak: true */
      posObj = (config.position === 'left')
             ? { 'left':  '20px' }
             : { 'right': '20px' },
      iframeStyle = _.extend(base, posObj);

  submitTickets[name] = {
    component: (
      <Frame style={iframeStyle} hide={false} closable={true} css={submitTicketCSS}>
        <SubmitTicket />
      </Frame>
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

function list() {
  return submitTickets;
}

function show(name) {
  get(name).component.setState({show: true});
}

function hide(name) {
  get(name).component.setState({show: false});
  if (getFormComponent(name).state.showNotification) {
    reset(name);
  }
}

function toggleVisibility(name) {
  var component = get(name).component;
  component.setState({show: !component.state.show});
  if (getFormComponent(name).state.showNotification) {
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
  list: list,
  show: show,
  hide: hide,
  toggleVisibility: toggleVisibility,
  reset: reset,
  getFormComponent: getFormComponent
};

