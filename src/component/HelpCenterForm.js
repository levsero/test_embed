import React, { Component, PropTypes } from 'react';
import { bindMethods } from 'utility/utils';

export class HelpCenterForm extends Component {
  constructor(props, context) {
    super(props, context);
    bindMethods(this, HelpCenterForm.prototype);

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

HelpCenterForm.propTypes = {
  children: PropTypes.object.isRequired,
  fullscreen: PropTypes.bool,
  onSubmit: PropTypes.func,
  onChange: PropTypes.func
};

HelpCenterForm.defaultProps = {
  fullscreen: false,
  onSubmit: () => {},
  onChange: () => {}
};
