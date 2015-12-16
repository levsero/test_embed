import React from 'react/addons';

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

  render() {
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

