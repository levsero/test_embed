export var formField = {
  getInitialState() {
    return {
      focused: false
    };
  },

  onFocus() {
    this.setState({
      focused: true
    });
  },

  onBlur() {
    this.setState({
      focused: false,
      blurred: true
    });
  }
};
