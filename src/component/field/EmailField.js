import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Field } from './Field';

export class EmailField extends Component {
  static propTypes = {
    value: PropTypes.oneOfType([
      PropTypes.number,
      PropTypes.string
    ]),
    label: PropTypes.string,
    required: PropTypes.bool,
    fieldContainerClasses: PropTypes.string,
    labelClasses: PropTypes.string,
    fieldClasses: PropTypes.string,
    inputClasses: PropTypes.string,
    placeholder: PropTypes.string
  };

  static defaultProps = {
    label: '',
    required: false,
    value: '',
    fieldContainerClasses: '',
    labelClasses: '',
    fieldClasses: '',
    inputClasses: '',
    placeholder: ''
  };

  render = () => {
    return (
      <Field
        label={this.props.label}
        required={this.props.required}
        value={this.props.value}
        placeholder={this.props.placeholder}
        name='email'
        pattern="[a-zA-Z0-9!#$%&'*+/=?^_`{|}~\-`']+(?:\.[a-zA-Z0-9!#$%&'*+/=?^_`{|}~\-`']+)*@(?:[a-zA-Z0-9](?:[a-zA-Z0-9-]*[a-zA-Z0-9])?\.)+[a-zA-Z0-9](?:[a-zA-Z0-9-]*[a-zA-Z0-9])?" // eslint-disable-line
        fieldContainerClasses={this.props.fieldContainerClasses}
        fieldClasses={this.props.fieldClasses}
        labelClasses={this.props.labelClasses}
        inputClasses={this.props.inputClasses}
      />
    );
  }
}
