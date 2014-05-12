/** @jsx React.DOM */

module React from 'react'; /* jshint ignore:line */
import { SubmitTicketForm } from 'component/SubmitTicketForm';
import { Frame } from 'component/Frame';

export var SubmitTicket = React.createClass({
  getInitialState: function() {
    return {showNotification: false, message: ''};
  },
  render: function() {
    var notifyVisibility = (this.state.showNotification) ?  '' : 'u-isHidden';
    var formVisibility = (this.state.showNotification) ? 'u-isHidden' : '';

    return (
      /* jshint quotmark:false */
      <div className='Container u-nbfc'>
        <h1 className={formVisibility}>How can I help you? </h1>
        <div className={"Notify " + notifyVisibility}>
          <div className="Notify-body Notify-body--success">
            <h1 className="Notify-title u-textCenter">{this.state.message}</h1>
          </div>
        </div>
        <div className={'Form ' + formVisibility}>
          <SubmitTicketForm />
        </div>
      </div>
    );
  }
});

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
  React.renderComponent(<Frame style={base}><SubmitTicket /></Frame>, element);
}

export var submitTicket = {
  render: render
};

