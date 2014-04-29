/** @jsx React.DOM */

module React from 'react';
import { Frame } from '../../components/Frame.js';

var SubmitTicket = React.createClass({


  render: function() {
    var base = {
          border: 'solid',
          height: '500px',
          width: '700px',
          position: 'fixed',
          top: '50%',
          left: '50%',
          margin: '-250px 0px 0px -350px',
          background: "white"
      };
    return (
      <Frame style={base}>
        <div>
          <div></div>
        </div>
      </Frame>
    );
  }
});

function create() {
  //submitTicket = <submitTicket />;
  //this.render();
}

function render() {
    var el = document.body.appendChild(document.createElement('div'));
    React.renderComponent(<SubmitTicket />, el);
  }


export var submitTicket = {
  create: create,
  render: render
};
