/** @jsx React.DOM */

module React from 'react/addons';

require('imports?_=lodash!lodash');

var classSet = React.addons.classSet;

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
    var buttonClasses = classSet({
          'Button Button--cta Anim-color u-textNoWrap u-user-backgroundColor': true,
          'u-pullRight': !this.props.fullscreen,
          'u-sizeFull u-textSizeBaseMobile': this.props.fullscreen,
          'u-isHidden': !this.props.hasSearched
        }),
        buttonContainerClasses = classSet({
          'u-marginTA': this.props.fullscreen
        }),
        formClasses = classSet({
          'Form u-cf': true
        });

    return (
      <form
        noValidate
        onSubmit={this.props.onSubmit}
        onChange={this.handleUpdate}
        className={formClasses}>
        {this.props.children}
        <div className={buttonContainerClasses}>
          <input
            type='button'
            value={this.props.buttonLabel}
            ref='submitButton'
            onClick={this.onClick}
            className={buttonClasses}
          />
        </div>
      </form>
    );
  }
});

export { HelpCenterForm };

