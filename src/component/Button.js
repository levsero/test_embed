/** @jsx React.DOM */

module React from 'react/addons';

var classSet = React.addons.classSet,
    Button,
    ButtonNav;

Button = React.createClass({
  render() {
      /* jshint laxbreak: true */
    var buttonClasses = classSet({
          'Button Button--cta Anim-color u-textNoWrap u-userBackgroundColor': true,
          'u-pullRight': !this.props.fullscreen,
          'u-sizeFull u-textSizeBaseMobile': this.props.fullscreen
        }),
        allowedTypes = /^(submit|button)$/i,
        type = allowedTypes.test(this.props.type)
             ? this.props.type
             : 'button';

    return (
      <input
        type={type}
        value={this.props.label}
        onClick={this.props.handleClick}
        onTouchStart={this.props.handleClick}
        disabled={this.props.disabled || false}
        className={buttonClasses}
      />
    );
  }
});

ButtonNav = React.createClass({
  render() {
    /* jshint quotmark:false */
    var buttonClasses = classSet({
          'Button Button--nav u-posAbsolute u-userTextColor': true,
          'u-posStartL': !this.props.fullscreen && this.props.position === 'left',
          'u-posStart--vertL': !this.props.fullscreen && this.props.position === 'left',
          'u-isActionable u-textSizeBaseMobile': this.props.fullscreen,
          'u-posStart u-posStart--vert': this.props.fullscreen && this.props.position === 'left',
          'u-posStart--vert': this.props.fullscreen && this.props.position === 'right',
          'u-pullRight u-posEnd': this.props.fullscreen && this.props.position === 'right'
        });

    return (
      <div
        onClick={this.props.handleClick}
        onTouchStart={this.props.handleClick}
        className={buttonClasses}>
        {this.props.label}
      </div>
    );
  }
});

export { Button, ButtonNav };
