import React, { Component, PropTypes } from 'react';

class HelpCenterForm extends React.Component {
  constructor(props, context) {
    super(props, context);
    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);

    this.state = {
      isValid: false,
      isSubmitting: false,
      focused: false
    };
  }

  handleSubmit(e) {
    e.preventDefault();

    // nextTick so that latest values show up on
    // searchField.getValue() in HelpCenter.*Search()
    setTimeout(this.props.onSubmit, 0);
  }

  handleChange() {
    // nextTick so that latest values show up on
    // searchField.getValue() in HelpCenter.*Search()
    setTimeout(this.props.onChange, 0);
  }

  render() {
    return (
      <form
        noValidate={true}
        onSubmit={this.handleSubmit}
        onChange={this.handleChange}
        className='Form u-cf'>
        {this.props.children}
      </form>
    );
  }
}

HelpCenterForm.defaultProps = {
  fullscreen: false
};

export { HelpCenterForm };

