module React from 'react/addons';

var classSet = React.addons.classSet;

var Button = React.createClass({
  propTypes: {
    label: React.PropTypes.string.isRequired,
    fullscreen: React.PropTypes.bool.isRequired,
    rtl: React.PropTypes.bool.isRequired,
    disabled: React.PropTypes.bool,
    handleClick: React.PropTypes.func,
    type: React.PropTypes.string
  },

  render() {
      /* jshint laxbreak: true */
    var buttonClasses = classSet({
          'Button Button--cta Anim-color u-textNoWrap u-userBackgroundColor': true,
          'u-sizeFull u-textSizeBaseMobile': this.props.fullscreen
        }),
        buttonContainerClasses = classSet({
          'u-textRight': !this.props.fullscreen && !this.props.rtl,
          'u-textLeft': !this.props.fullscreen && this.props.rtl
        }),
        allowedTypes = /^(submit|button)$/i,
        type = allowedTypes.test(this.props.type)
             ? this.props.type
             : 'button';

    return (
      <div className={buttonContainerClasses}>
        <input
          type={type}
          value={this.props.label}
          onClick={this.props.handleClick}
          onTouchStart={this.props.handleClick}
          disabled={this.props.disabled || false}
          className={buttonClasses}
        />
      </div>
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
          'u-isActionable u-textSizeBaseMobile u-posStart--vertFlush': fullscreen,
          'u-posStart u-paddingL u-posStart--flush': fullscreen && position === 'left',
          'u-posEnd u-paddingR u-posEnd--flush': fullscreen && position === 'right'
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
