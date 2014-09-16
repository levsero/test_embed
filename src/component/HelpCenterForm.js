/** @jsx React.DOM */

module React from 'react/addons';

import { i18n } from 'service/i18n';

require('imports?_=lodash!lodash');

var classSet = React.addons.classSet;

var HelpCenterForm = React.createClass({
  getInitialState() {
    return {
      isValid: false,
      buttonLabel: i18n.t('embeddable_framework.helpCenter.submitButton.label.submitTicket'),
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
          'Button Button--cta Anim-color u-textNoWrap': true,
          'u-pullRight': !this.props.fullscreen,
          'u-sizeFull u-textSizeBaseMobile': this.props.fullscreen
        }),
        buttonContainerClasses = classSet({
          'u-borderTop u-marginTA u-paddingTM': this.props.fullscreen
        }),
        formClasses = classSet({
          'Form u-cf': true,
          'Form--fullscreen': this.props.fullscreen
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
            value={this.state.buttonLabel}
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

