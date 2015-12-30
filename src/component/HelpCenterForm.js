import React from 'react/addons';
import { noop } from 'lodash';

const HelpCenterForm = React.createClass({
  propTypes: {
    children: React.PropTypes.element.isRequired,
    fullscreen: React.PropTypes.bool,
    onSubmit: React.PropTypes.func,
    onChange: React.PropTypes.func
  },

  getDefaultProps() {
    return {
      fullscreen: false,
      onSubmit: noop,
      onChange: noop
    };
  },

  getInitialState() {
    return {
      isValid: false,
      isSubmitting: false,
      focused: false
    };
  },

  handleSubmit(e) {
    e.preventDefault();

    // nextTick so that latest values show up on
    // searchField.getValue() in HelpCenter.*Search()
    setTimeout(this.props.onSubmit, 0);
  },

  handleChange() {
    // nextTick so that latest values show up on
    // searchField.getValue() in HelpCenter.*Search()
    setTimeout(this.props.onChange, 0);
  },

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
});

export { HelpCenterForm };

