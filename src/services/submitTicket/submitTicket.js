/** @jsx React.DOM */

module React from 'react'; /* jshint ignore:line */
import { Frame } from 'component/Frame';
import { validations } from 'mixin/validation';
import { TextAreaInput } from 'component/TextAreaInput';
import { TextInput } from 'component/TextInput';
import { transport } from 'src/transport';
import { identity } from 'src/identity';
require('imports?_=lodash!lodash');

var submitTicketCSS = require('./SubmitTicket.scss');

export var SubmitTicket = React.createClass({
  getInitialState: function() {
    return {showNotification: false, message: ''};
  },
  handleClick: function() {
    var refs = this.refs,
        formParams = {
          'subject': refs.subjectField.refs.inputText.getDOMNode().value,
          'name': refs.nameField.refs.inputText.getDOMNode().value,
          'email': refs.emailField.refs.inputText.getDOMNode().value,
          'description': refs.descriptionField.refs.inputText.getDOMNode().value,
          'set_tags': 'buid-' + identity.getBuid()
        },
        errors = _.union(
          refs.subjectField.state.errors,
          refs.nameField.state.errors,
          refs.emailField.state.errors,
          refs.descriptionField.state.errors
        );

    if (errors.length !== 0) {
      return;
    }
    var form = this;
    var payload = {
      method: 'POST',
      path: '/api/ticket_submission',
      params: formParams,
      callbacks: {
        done: function() {
          form.setState({
            showNotification: true,
            message: 'Ticket Submitted! Thanks!'
          });
        },
        fail: function(data, status) {
          form.setState({
            showNotification: true,
            message: 'Error ' + status + ': ' + JSON.parse(data).error
          });
        }
      }
    };
    transport.send(payload);
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
          <form action='' method='post'>
            <div className='Form-container'>
              <div className='Grid'>
                <TextInput
                  ref='subjectField'
                  name='Subject'
                  validate={validations.baseValidation}
                  placeholder='What do you need help with?'
                  className='Grid-cell Form-field'
                />
              </div>
              <div className='Grid'>
                <TextAreaInput
                  ref='descriptionField'
                  validate={validations.baseValidation}
                  className='Grid-cell Form-field'
                />
              </div>
              <div className='Grid Grid--withGutter'>
                <TextInput
                  ref='nameField'
                  name='Name'
                  placeholder=''
                  validate={validations.baseValidation}
                  className='Grid-cell u-size1of2 Form-field'
                />
                <TextInput
                  ref='emailField'
                  name='Email'
                  placeholder=''
                  validate={validations.emailValidation}
                  className='Grid-cell u-size1of2 Form-field'
                />
              </div>
            </div>
          </form>
        <input
          type='submit'
          onClick={this.handleClick}
          className='Button Button--default u-pullRight'
        />
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
  React.renderComponent(<Frame style={base} css={submitTicketCSS}><SubmitTicket /></Frame>, element);
}

export var submitTicket = {
  render: render
};

