/** @jsx React.DOM */
module React from 'react'; /* jshint ignore:line */
import { validation } from 'mixin/validation';
require('imports?_=lodash!lodash');

export var TextInput = React.createClass ({
  mixins: [validation.ValidationMixin],
  propTypes: {
    name: React.PropTypes.string,
    validate: React.PropTypes.array,
    placeholder: React.PropTypes.string,
    className: React.PropTypes.string
  },
  getInitialState: function() {
     return {
       value: '',
       errors: [],
       id: _.uniqueId('input_')
     };
  },
  handleChange: function(event) {
    this.setState({value: event.target.value});
    if(this.state.errors.length !== 0) {
      this.setState({errors: this.hasErrors()});
    }
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
      <div className={this.props.className}>
        <label htmlFor={this.state.id} className='u-block Form-field-label'>
          {this.props.name}
          <abbr title='Required'>*</abbr>
        </label>
        <input
          ref='inputText'
          id={this.state.id}
          value={value}
          onChange={this.handleChange}
          onBlur={this.handleBlur}
          placeholder={this.props.placeholder}
          title='Please fill out this field.'
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
