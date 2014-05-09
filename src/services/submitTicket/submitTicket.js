/** @jsx React.DOM */

module React from 'react'; /* jshint ignore:line */
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
  validations.regexMatcherCondition(/[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?/, 'email address') /* jshint ignore:line */
];

var SubmitTicket = React.createClass({
  handleClick: function() {
    var refs = this.refs,
        formParams = {
          subject: refs.subjectField.refs.inputText.getDOMNode().value,
          name: refs.nameField.refs.inputText.getDOMNode().value,
          email: refs.emailField.refs.inputText.getDOMNode().value,
          description: refs.descriptionField.refs.inputText.getDOMNode().value,
          set_tags: 'buid-' + identity.getBuid() /* jshint ignore:line */
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
    var payload = {
      method: 'POST',
      path: '/api/ticket_submission',
      params: formParams,
      callbacks: {
        done: function(data, status, xhr) { /* jshint ignore:line */
          refs.screen.props.message = 'Done!';
          refs.screen.forceUpdate();
        },
        fail: function(data, status, xhr) { /* jshint ignore:line */
          refs.screen.props.message = 'Failed!';
          refs.screen.forceUpdate();
        }
      }
    };
    transport.send(payload);
  },

  render: function() {
    /* jshint quotmark:false */
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
    return (
      <Frame style={base}>
        <div className='Container u-nbfc'>
          <h1>How can I help you?</h1>
          <DoneScreen ref='screen' message='' />
          <form action='' method='post' className='Form'>
            <div className='Text-container'>
              <div className='Grid'>
                <TextInput
                  ref='subjectField'
                  name='Subject'
                  validate={baseValidation}
                  placeholder='What do you need help with?'
                  style='Grid-cell Form-field'
                />
              </div>
              <div className='Grid'>
                <TextAreaInput
                  ref='descriptionField'
                  validate={baseValidation}
                  style='Grid-cell Form-field'
                />
              </div>
              <div className='Grid Grid--withGutter'>
                <TextInput
                  ref='nameField'
                  name='Name'
                  placeholder=''
                  validate={baseValidation}
                  style='Grid-cell u-size1of2 Form-field'
                />
                <TextInput
                  ref='emailField'
                  name='Email'
                  placeholder=''
                  validate={emailValidation}
                  style='Grid-cell u-size1of2 Form-field'
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
      </Frame>
    );
  }
});

var DoneScreen = React.createClass({
  render: function() {
    /* jshint quotmark:false */
    return (
      <div className="Notify u-isHidden">
        <div className="Notify-body Notify-body--success">
          <h1 className="Notify-title u-textCenter">{this.props.message}</h1>
        </div>
      </div>
    );
  }
});

function render() {
  var element = document.body.appendChild(document.createElement('div'));
  React.renderComponent(<SubmitTicket />, element);
}

export var submitTicket = {
  render: render
};

