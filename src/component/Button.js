/** @jsx React.DOM */

module React from 'react/addons';

var classSet = React.addons.classSet;

var Button = React.createClass({
  render() {
      /* jshint laxbreak: true */
    var buttonClasses = classSet({
          'Button Button--cta Anim-color u-textNoWrap u-userBackgroundColor': true,
          'u-pullRight': !this.props.fullscreen && !this.props.rtl,
          'u-pullLeft': !this.props.fullscreen && this.props.rtl,
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

var ButtonNav = React.createClass({
  render() {
    /* jshint quotmark:false */
    var fullscreen = this.props.fullscreen,
        position = this.props.position,
        buttonClasses = classSet({
          'Button Button--nav u-posAbsolute u-userTextColor': true,
          'u-posStartL u-posStart--vertL': !fullscreen && position === 'left',
          'u-isActionable u-textSizeBaseMobile': fullscreen,
          'u-posStart u-posStart--vert': fullscreen && position === 'left',
          'u-posStart--vert u-pullRight u-posEnd': fullscreen && position === 'right'
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
