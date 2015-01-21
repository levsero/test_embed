/** @jsx React.DOM */

module React from 'react/addons';

var classSet = React.addons.classSet;

export var Button = React.createClass({
  render() {
    /* jshint quotmark:false */
    var buttonClasses = classSet({
          'Button Button--cta Anim-color u-textNoWrap u-userBackgroundColor': true,
          'u-pullRight': !this.props.fullscreen,
          'u-sizeFull u-textSizeBaseMobile': this.props.fullscreen
        });

    return (
      <input
        type={this.props.type || 'button'}
        value={this.props.label}
        onClick={this.props.onPressed}
        disabled={this.props.disabled || false}
        className={buttonClasses}
      />
    );
  }
});
