/** @jsx React.DOM */

module React from 'react'; /* jshint ignore:line */
import { Frame        } from 'component/Frame';
import { SubmitTicket } from 'component/SubmitTicket';

var submitTicketCSS = require('./submitTicket.scss');

function render() {
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
  var element = document.body.appendChild(document.createElement('div'));
  React.renderComponent(<Frame style={base} css={submitTicketCSS}><SubmitTicket /></Frame>, element);
}

export var submitTicket = {
  render: render
};

