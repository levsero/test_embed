import React, { Component } from 'react';
import PropTypes from 'prop-types';
import _ from 'lodash';

import { Button } from 'component/button/Button';
import { ButtonGroup } from 'component/button/ButtonGroup';

export class Form extends Component {
  static propTypes = {
    formState: PropTypes.object,
    className: PropTypes.string,
    children: PropTypes.node,
    rtl: PropTypes.bool,
    isMobile: PropTypes.bool,
    submitButtonLabel: PropTypes.string,
    onCompleted: PropTypes.func,
    onChange: PropTypes.func,
    submitButtonClasses: PropTypes.string
  };

  static defaultProps = {
    formState: {},
    className: '',
    children: null,
    rtl: false,
    isMobile: false,
    submitButtonLabel: '',
    onCompleted: () => {},
    onChange: () => {},
    submitButtonClasses: ''
  };

  constructor() {
    super();

    this.state = {
      valid: false
    };

    this.form = null;
  }

  componentDidMount = () => {
    this.setState({ valid: this.isFormValid() });
  }

  isFormValid = () => {
    return this.form.checkValidity() && !_.isEmpty(this.props.formState);
  }

  validate() {
    this.setState({ valid: this.isFormValid() });
  }

  handleFormSubmit = (e) => {
    e.preventDefault();

    this.props.onCompleted(this.props.formState);
  }

  handleFormChange = (e) => {
    const { name, value } = e.target;
    const fieldState = { [name]: value };
    const formState = { ...this.props.formState, ...fieldState };

    this.validate();
    this.props.onChange(formState);
  }

  renderSubmitButton = () => {
    return (
      <ButtonGroup fullscreen={this.props.isMobile} rtl={this.props.rtl}>
        <Button
          className={this.props.submitButtonClasses}
          fullscreen={this.props.isMobile}
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
