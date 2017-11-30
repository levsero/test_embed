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
        name='email'
        pattern="[a-zA-Z0-9!#$%&'*+/=?^_`{|}~\-`']+(?:\.[a-zA-Z0-9!#$%&'*+/=?^_`{|}~\-`']+)*@(?:[a-zA-Z0-9](?:[a-zA-Z0-9-]*[a-zA-Z0-9])?\.)+[a-zA-Z0-9](?:[a-zA-Z0-9-]*[a-zA-Z0-9])?" // eslint-disable-line
        />
    );
  }
}
