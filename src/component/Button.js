import React from 'react/addons';

import { SVGIcon } from 'component/SvgIcon';

var classSet = React.addons.classSet;

var Button = React.createClass({
  propTypes: {
    label: React.PropTypes.string.isRequired,
    disabled: React.PropTypes.bool,
    handleClick: React.PropTypes.func,
    type: React.PropTypes.string
  },

  render() {
      /* jshint laxbreak: true */
    var buttonClasses = classSet({
          'c-btn c-btn--medium c-btn--primary': true,
          'Anim-color u-textNoWrap u-borderTransparent u-userBackgroundColor': true,
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
        disabled={this.props.disabled}
        className={buttonClasses} />
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

var ButtonPill = React.createClass({
  render() {
    var buttonClasses = classSet({
          'c-btn c-btn--medium c-btn--secondary c-btn--pill': true,
          'u-textNormal': true,
          'u-sizeFull u-textSizeBaseMobile is-mobile': this.props.fullscreen,
        });

    return (
      <div
        className={buttonClasses}>
        {this.props.label}
        <SVGIcon type='Icon--link' />
      </div>
    );
  }
});

var ButtonSecondary = React.createClass({
  propTypes: {
    label: React.PropTypes.string.isRequired
  },

  render() {
    return (
      <div
        onClick={this.props.onClick}
        onTouchStart={this.props.onClick}
        className='c-btn c-btn--medium c-btn--secondary'>
        {this.props.label}
      </div>
    );
  }
});

var ButtonGroup = React.createClass({
  propTypes: {
    rtl: React.PropTypes.bool.isRequired
  },

  render() {
    var buttonClasses = classSet({
          'ButtonGroup': true,
          'u-textRight': !this.props.fullscreen && !this.props.rtl,
          'u-textLeft': !this.props.fullscreen && this.props.rtl
        });

    return (
      <div className={buttonClasses}>{this.props.children}</div>
    );
  }
});

export { Button, ButtonNav, ButtonPill, ButtonSecondary, ButtonGroup };
