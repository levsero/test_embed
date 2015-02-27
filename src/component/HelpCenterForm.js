/** @jsx React.DOM */

module React from 'react/addons';

require('imports?_=lodash!lodash');

var HelpCenterForm = React.createClass({
  getInitialState() {
    return {
      isValid: false,
      isSubmitting: false,
      focused: false
    };
  },

  getDefaultProps() {
    return {
      fullscreen: false
    };
  },

  handleUpdate() {
    this.props.onSearch();
  },

  onClick() {
    this.props.onButtonClick();
  },

  render() {
    /* jshint quotmark:false */

    return (
      <form
        noValidate
        onSubmit={this.props.onSubmit}
        onChange={this.handleUpdate}
        className='Form u-cf'>
        {this.props.children}
      </form>
    );
  }
});

export { HelpCenterForm };

