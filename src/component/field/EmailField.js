import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { TextField, Label, Input } from '@zendeskgarden/react-textfields';

export class EmailField extends Component {
  static propTypes = {
    value: PropTypes.oneOfType([
      PropTypes.number,
      PropTypes.string
    ]),
    label: PropTypes.string,
    required: PropTypes.bool,
    placeholder: PropTypes.string,
    onKeyPress: PropTypes.func,
    disabled: PropTypes.bool,
    name: PropTypes.string
  };

  static defaultProps = {
    label: '',
    required: false,
    value: '',
    placeholder: '',
    onKeyPress: () => {},
    disabled: false,
    name: ''
  };

  render = () => {
    return (
      <TextField>
        <Label>
          {this.props.label}
        </Label>
        <Input
          required={this.props.required}
          aria-required={this.props.required}
          value={this.props.value}
          autoComplete='off'
          onChange={() => {}} // stop react warning
          placeholder={this.props.placeholder}
          onKeyPress={this.props.onKeyPress}
          disabled={this.props.disabled}
          name={this.props.name}
          pattern="[a-zA-Z0-9!#$%&'*+/=?^_`{|}~\-`']+(?:\.[a-zA-Z0-9!#$%&'*+/=?^_`{|}~\-`']+)*@(?:[a-zA-Z0-9](?:[a-zA-Z0-9-]*[a-zA-Z0-9])?\.)+[a-zA-Z0-9](?:[a-zA-Z0-9-]*[a-zA-Z0-9])?" // eslint-disable-line
          type='email' />
      </TextField>
    );
  }
}
