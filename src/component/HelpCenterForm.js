/** @jsx React.DOM */

module React from 'react/addons';

import { Button } from 'component/Button';

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
    var buttonContainerClasses = classSet({
          'u-marginTA': this.props.fullscreen,
          'u-isHidden': !this.props.hasSearched
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
          <Button
            label={this.props.buttonLabel}
            handleClick={this.onClick}
          />
        </div>
      </form>
    );
  }
});

export { HelpCenterForm };

