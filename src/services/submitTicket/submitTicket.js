/** @jsx React.DOM */

module React from 'react';

var SubmitTicket = React.createClass({
  render: function() {
    return (
      <h1>testing</h1>
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
