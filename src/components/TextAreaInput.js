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
  handleBlur: function() {
    var errors = this.hasErrors();
    this.setState({errors: errors});
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
          Message
          <abbr title='Requied'>*</abbr>
        </label>
        <textarea
          ref='inputText'
          id='description'
          value={value}
          onBlur={this.handleBlur}
          onChange={this.handleChange}
          name='description'
          placeholder='Give us details here...'
          required rows='6'
          title='Please fill out this field.'
          className='u-sizeFull Form-field-element'
        ></textarea>
        <div>
          <ul>{errorList}</ul>
        </div>
      </div>
    );
  }
});
