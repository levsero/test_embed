/** @jsx React.DOM */

module React from 'react/addons';

import { isMobileBrowser } from 'utility/devices';

var classSet = React.addons.classSet;

var Button = React.createClass({
  render() {
    /* jshint quotmark:false */
    var buttonClasses = classSet({
          'Button Button--cta Anim-color u-textNoWrap u-userBackgroundColor': true,
          'u-pullRight': !isMobileBrowser(),
          'u-sizeFull u-textSizeBaseMobile': isMobileBrowser()
        });

    return (
      <input
        type={this.props.type || 'button'}
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
    var buttonClasses = classSet({
          'Button Button--nav u-posAbsolute u-userTextColor': true,
          'u-posStart u-posStart--vert': isMobileBrowser() && this.props.position==='right',
          'u-posStartL u-posStart--vertL': !isMobileBrowser() && this.props.position==='right',
          'u-isActionable u-textSizeBaseMobile': isMobileBrowser(),
          'u-pullRight u-posEnd u-posStart--vert': isMobileBrowser() && this.props.position==='left'
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

export { Button, ButtonNav }
