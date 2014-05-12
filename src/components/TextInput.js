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
    this.setState({errors: this.hasErrors()});
  },
  render: function() {
    var value = this.state.value;
    var errorList = this.state.errors.map(function(item) {
      return <li>{item}</li>;
    });
    return (
      /* jshint quotmark:false */
      <div className={this.props.style}>
        <label className='u-block Form-field-label'>
          {this.props.name}
          <abbr title='Required'>*</abbr>
        </label>
        <input
          ref='inputText'
          value={value}
          onChange={this.handleChange}
          onBlur={this.handleBlur}
          placeholder={this.props.placeholder}
          required title='Please fill out this field.'
          type='text'
          className='u-sizeFull Form-field-element'
        />
        <div>
          <ul>{errorList}</ul>
        </div>
      </div>
    );
  }
});
