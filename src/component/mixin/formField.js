export var formField = {
  getInitialState() {
    return {
      focused: false,
      blurred: false
    };
  },

  onFocus() {
    if (_.isFunction(this.props.onFocus)) {
      this.props.onFocus();
    }
    this.setState({
      focused: true
    });
  },

  onBlur() {
    if (_.isFunction(this.props.onBlur)) {
      this.props.onBlur();
    }
    this.setState({
      focused: false,
      blurred: true
    });
  }
};
