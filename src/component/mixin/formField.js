export var formField = {
  getInitialState() {
    return {
      focused: false,
      blurred: false
    };
  },

  onFocus() {
    this.props.onFocus();
    this.setState({
      focused: true
    });
  },

  onBlur() {
    this.props.onBlur();
    this.setState({
      focused: false,
      blurred: true
    });
  }
};
