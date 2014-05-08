/** @jsx React.DOM */
module React from 'react'; /* jshint ignore:line */
import { validations } from '../mixins/validation.js';

export var TextInput = React.createClass ({
  mixins: [validations.ValidationMixin],
  getInitialState: function() {
     return {value: '', errors: []};
  },
  handleChange: function(event) {
    this.setState({value: event.target.value});
  },
  handleBlur: function() {
    var errors = this.hasErrors();
    console.log(errors);
    this.setState({errors: errors});
  },
  render: function() {
    /* jshint quotmark:false */
    var value = this.state.value;
    var errorList = this.state.errors.map(function(item) {
      return <li>{item}</li>;
    });
    return (
      <div class={this.props.style}>
        <label class='u-block Text-field-label'>
          {this.props.name}
          <abbr title='Requied'>
            *
          </abbr>
        </label>
        <input
          ref='inputText'
          value={value}
          onChange={this.handleChange}
          onBlur={this.handleBlur}
          placeholder={this.props.placeholder}
          required title='Please fill out this field.'
          type='text'
          class='u-sizeFull Text-field-element'
        />
        <div>
          <ul>{errorList}</ul>
        </div>
      </div>
    );
  }
});
