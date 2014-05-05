/** @jsx React.DOM */

module React from 'react';
import { Frame } from '../../components/Frame.js';
import { validations } from '../../mixins/validation.js';

var baseValidation = [validations.notEmptyCondition];
var emailValidation = [validations.notEmptyCondition, validations.symbolIncludedCondition('@'), validations.symbolIncludedCondition('.')];

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
        <div class="Container u-nbfc">
          <h1>How can I help you?</h1>
          <form action="https://<%= @host %>/requests/embedded/create/" method="post" class='Text'>
            <div class="Text-container">
              <div class="Grid">
                <div class="Grid-cell Text-field">
                  <TextInput name="Description" validate={baseValidation} placeholder="What do you need help with?"/>
                </div>
              </div>
              <div class="Grid">
                <div class="Grid-cell Text-field">
                  <TextAreaInput validate={baseValidation} />
                </div>
              </div>
              <div class="Grid Grid--withGutter">
                <div class="Grid-cell u-size1of2 Text-field">
                  <TextInput name="Name" placeholder="" validate={baseValidation}/>
                </div>
                <div class="Grid-cell u-size1of2 Text-field">
                  <TextInput name="Email" placeholder="" validate={emailValidation}/>
                </div>
              </div>
            </div>

            <input id='locale_id' name='locale_id' type='hidden' value='1' />
            <input id='set_tags' name='set_tags' type='hidden' value='dropbox buid-xxx' />
            <input id='via_id' name='via_id' type='hidden' value='17' />
            <input id='client' name='client' type='hidden' value='' />
            <input id='submitted_from' name='submitted_from' type='hidden' value='' />

          </form>
        <Button />
        </div>
      </Frame>
    );
  }
});

function render() {
  var el = document.body.appendChild(document.createElement('div'));
  React.renderComponent(<SubmitTicket />, el);
}


var TextInput = React.createClass ({
  mixins: [validations.ValidationMixin],
  getInitialState: function() {
     return {value: '', errors: []};
  },
  handleChange: function(event) {
    this.setState({value: event.target.value});
  },
  handleBlur: function(event) {
    var errors = this.hasErrors();
    console.log(errors);
    this.setState({errors: errors});
  },
  render: function() {
    var value = this.state.value;
    var errorList = this.state.errors.map(function(item) {
      return <li>{item}</li>;
    });
    return (
      <div>
        <label class='u-block Text-field-label'>{this.props.name}<abbr title='Requied'>*</abbr></label>
        <input value={value}  onChange={this.handleChange} onBlur={this.handleBlur} placeholder={this.props.placeholder} required title='Please fill out this field.' type='text' class='u-sizeFull Text-field-element' />
        <div>
          <ul>{errorList}</ul>
        </div>
      </div>
    );
  }
});

var TextAreaInput = React.createClass ({
  mixins: [validations.ValidationMixin],
  getInitialState: function() {
     return {value: '', errors: []};
  },
  handleChange: function(event) {
    this.setState({value: event.target.value});
  },
  handleBlur: function(event) {
    var errors = this.hasErrors();
    console.log(errors);
    this.setState({errors: errors});
  },
  render: function() {
    var value = this.state.value;
    var errorList = this.state.errors.map(function(item) {
      return <li>{item}</li>;
    });
    return (
      <div>
        <label class="u-block Text-field-label">Message<abbr title="Requied">*</abbr></label>
        <textarea id="description" value={value} onBlur={this.handleBlur} onChange={this.handleChange} name="description" placeholder="Give us details here..." required rows="6" title="Please fill out this field." class="u-sizeFull Text-field-element"></textarea>
        <div>
          <ul>{errorList}</ul>
        </div>
      </div>
    );
  }
});

var Button = React.createClass ({
  render: function() {
    return  <input type="submit" class="Button Button--default u-pullRight"/>;
  }
});

export var submitTicket = {
  render: render
};

