/** @jsx React.DOM */
module React from 'react'; /* jshint ignore:line */
require('imports?_=lodash!lodash');
import { validation } from 'mixin/validation';

export var TextAreaInput = React.createClass ({
  mixins: [validation.ValidationMixin],
  propTypes: {
    validate: React.PropTypes.array,
    className: React.PropTypes.string
  },
  getInitialState: function() {
    return {
      value: '',
      errors: [],
      id: _.uniqueId('description_'),
      errorId: _.uniqueId('errors_')
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
    var value = this.state.value,
        input = this,
        errorList = this.state.errors.map(function(item) {
          return <li key={input.state.errorId}>{item}</li>;
        });

    return (
      /* jshint quotmark:false */
      <div className={this.props.className}>
        <label htmlFor={this.state.id} className='u-block Form-field-label'>
          Message
          <abbr title='Required'>*</abbr>
        </label>
        <textarea
          ref='inputText'
          id={this.state.id}
          value={value}
          onBlur={this.handleBlur}
          onChange={this.handleChange}
          placeholder='Give us details here...'
          rows='6'
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
