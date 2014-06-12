/** @jsx React.DOM */
module React from 'react'; /* jshint ignore:line */
require('imports?_=lodash!lodash');
import { validation } from 'mixin/validation';

export var TextAreaInput = React.createClass({
  mixins: [validation.ValidationMixin],
  propTypes: {
    validate: React.PropTypes.array,
    className: React.PropTypes.string
  },
  getInitialState() {
    return {
      value: '',
      errors: [],
      id: _.uniqueId('description_')
    };
  },
  handleChange(event) {
    var value = event.target.value;

    this.setState({value: value});

    if(value.length >= 5) {
      this.props.showField();
    }

    if (this.state.errors.length !== 0) {
      this.setState({errors: this.hasErrors()});
    }
  },
  handleBlur() {
    this.setState({errors: this.hasErrors()});
  },
  render() {
    /*jshint quotmark:false, laxcomma:true */
    var value = this.state.value,
        errorList = this.state.errors.map(item => (
          <li
            key={_.uniqueId('error_')}
            className='Error-item'
            >{item}</li>
        ));

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
        <div className='Error'>
          <ul>{errorList}</ul>
        </div>
      </div>
    );
  }
});
