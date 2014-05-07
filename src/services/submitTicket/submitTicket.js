/** @jsx React.DOM */

/* jshint ignore:start */
module React from 'react';
import { _ } from 'lodash';
import { Frame } from '../../components/Frame';
import { validations } from '../../mixins/validation';
import { TextAreaInput } from '../../components/TextAreaInput';
import { TextInput } from '../../components/TextInput';
import { transport } from '../../transport';
import { identity } from '../../identity';

var baseValidation = [
  validations.notEmptyCondition
];
var emailValidation = [
  validations.notEmptyCondition,
  validations.regexMatcherCondition('@'),
  validations.regexMatcherCondition('.')
];
/* jshint ignore:end */

var SubmitTicket = React.createClass({
  handleClick: function() {
    var formParams = {
          subject: this.refs.subjectField.refs.inputText.getDOMNode().value,
          name: this.refs.nameField.refs.inputText.getDOMNode().value,
          email: this.refs.emailField.refs.inputText.getDOMNode().value,
          description: this.refs.descriptionField.refs.inputText.getDOMNode().value,
          set_tags: 'buid-' + identity.getBuid() /* jshint ignore:line */
        },
        errors = _.union(
          this.refs.subjectField.state.errors,
          this.refs.nameField.state.errors,
          this.refs.emailField.state.errors,
          this.refs.descriptionField.state.errors
        );

    if (errors.length !== 0) {
      console.log('fail');
      return;
    }
    var payload = {
      method: 'POST',
      path: '/api/ticket_submission',
      params: formParams,
      callbacks: {
        done: function(data, status, xhr) {}, /* jshint ignore:line */
        fail: function(data, status, xhr) {} /* jshint ignore:line */
      }
    };
    transport.send(payload); /* jshint ignore:line */
  },

  render: function() {
    /* jshint ignore:start */
    var base = {
      border: 'solid',
      height: '500px',
      width: '700px',
      position: 'fixed',
      top: '50%',
      left: '50%',
      margin: '-250px 0px 0px -350px',
      background: 'white'
    };
    return (
      <Frame style={base}>
        <div class='Container u-nbfc'>
          <h1>How can I help you?</h1>
          <form action='' method='post' class='Text'>
            <div class='Text-container'>
              <div class='Grid'>
                <div class='Grid-cell Text-field'>
                  <TextInput ref='subjectField' name='Subject' validate={baseValidation} placeholder='What do you need help with?'/>
                </div>
              </div>
              <div class='Grid'>
                <div class='Grid-cell Text-field'>
                  <TextAreaInput ref='descriptionField' validate={baseValidation} />
                </div>
              </div>
              <div class='Grid Grid--withGutter'>
                <div class='Grid-cell u-size1of2 Text-field'>
                  <TextInput ref='nameField' name='Name' placeholder='' validate={baseValidation}/>
                </div>
                <div class='Grid-cell u-size1of2 Text-field'>
                  <TextInput ref='emailField' name='Email' placeholder='' validate={emailValidation}/>
                </div>
              </div>
            </div>

            <input id='locale_id' name='locale_id' type='hidden' value='1' />
            <input id='set_tags' name='set_tags' type='hidden' value='dropbox buid-{placeholder}' />
            <input id='via_id' name='via_id' type='hidden' value='17' />
            <input id='client' name='client' type='hidden' value='' />
            <input id='submitted_from' name='submitted_from' type='hidden' value='' />

          </form>
        <input type='submit' onClick={this.handleClick} class='Button Button--default u-pullRight'/>
        </div>
      </Frame>
    );
  /* jshint ignore:end */
  }
});

function render() {
  var el = document.body.appendChild(document.createElement('div'));
  React.renderComponent(<SubmitTicket />, el);
}

export var submitTicket = {
  render: render
};

