/** @jsx React.DOM */

module React from 'react'; /* jshint ignore:line */
import { Frame        } from 'component/Frame';
import { SubmitTicket } from 'component/SubmitTicket';
import { CloseHandler } from 'component/CloseHandler';

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
      },
      element = document.body.appendChild(document.createElement('div'));

  element.id = 'reactForm';
  if(React.unmountComponentAtNode(document.getElementById('reactForm'))) {
    var elem = document.getElementById('reactForm');
    elem.parentNode.removeChild(elem);
  }

  React.renderComponent(
    <CloseHandler>
      <Frame style={base} css={submitTicketCSS}>
        <SubmitTicket />
      </Frame>
    </CloseHandler>,
    element
  );
}

export var submitTicket = {
  render: render
};

