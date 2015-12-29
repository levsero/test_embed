import React from 'react/addons';

const HelpCenterForm = React.createClass({
  getDefaultProps() {
    return {
      fullscreen: false
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

