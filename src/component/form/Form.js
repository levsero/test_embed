import React, { Component } from 'react';
import PropTypes from 'prop-types';

import { Button } from 'component/button/Button';
import { ButtonGroup } from 'component/button/ButtonGroup';

export class Form extends Component {
  static propTypes = {
    className: PropTypes.string,
    children: PropTypes.node,
    rtl: PropTypes.bool,
    submitButtonLabel: PropTypes.string,
    onCompleted: PropTypes.func,
    onChange: PropTypes.func
  };

  static defaultProps = {
    className: '',
    children: null,
    rtl: false,
    submitButtonLabel: '',
    onCompleted: () => {},
    onChange: () => {}
  };

  constructor() {
    super();

    this.state = {
      formState: {},
      valid: false
    };

    this.form = null;
  }

  clear = () => {
    const formState = {};

    this.setState({ formState, valid: false });
    this.props.onChange(formState);
  }

  handleFormSubmit = (e) => {
    e.preventDefault();

    this.props.onCompleted(this.state.formState);
  }

  handleFormChange = (e) => {
    const { name, value } = e.target;
    const fieldState = { [name]: value };
    const formState = { ...this.state.formState, ...fieldState };

    this.setState({
      valid: this.form.checkValidity(),
      formState
    });

    this.props.onChange(formState);
  }

  renderSubmitButton = () => {
    return (
      <ButtonGroup rtl={this.props.rtl}>
        <Button
          label={this.props.submitButtonLabel}
          disabled={!this.state.valid}
          type='submit' />
      </ButtonGroup>
    );
  }

  render = () => {
    return (
      <form
        noValidate={true}
        onSubmit={this.handleFormSubmit}
        onChange={this.handleFormChange}
        ref={(el) => this.form = el}
        className={this.props.className}>
        {this.props.children}
        {this.renderSubmitButton()}
      </form>
    );
  }
}
