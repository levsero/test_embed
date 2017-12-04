import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Field } from 'component/field/Field';
import { isValidNumber } from 'libphonenumber-js';

export class TalkPhoneField extends Component {
  static propTypes = {
    value: PropTypes.oneOfType([
      PropTypes.number,
      PropTypes.string
    ]),
    label: PropTypes.string,
    required: PropTypes.bool
  };

  static defaultProps = {
    label: '',
    required: false,
    value: ''
  };

  render = () => {
    return (
      <Field
        label={this.props.label}
        required={this.props.required}
        value={this.props.value}
        name='phone'
        validateInput={isValidNumber} />
    );
  }
}
