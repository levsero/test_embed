/** @jsx React.DOM */
module React from 'react'; /* jshint ignore:line */
import { validations } from '../mixins/validation.js';

export var TextAreaInput = React.createClass ({
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
        <label class='u-block Text-field-label'>Message<abbr title='Requied'>*</abbr></label>
        <textarea id='description' value={value} onBlur={this.handleBlur} onChange={this.handleChange} name='description' placeholder='Give us details here...' required rows='6' title='Please fill out this field.' class='u-sizeFull Text-field-element'></textarea>
        <div>
          <ul>{errorList}</ul>
        </div>
      </div>
    );
  }
});
