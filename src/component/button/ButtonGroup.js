import React, { Component, PropTypes } from 'react';
import classNames from 'classnames';

export class ButtonGroup extends Component {
  static propTypes = {
    children: PropTypes.node.isRequired,
    fullscreen: PropTypes.bool,
    rtl: PropTypes.bool,
    style: PropTypes.element
  };

  static defaultProps = {
    fullscreen: false,
    rtl: false,
    style: null
  };

  render = () => {
    const buttonClasses = classNames({
      'ButtonGroup': true,
      'u-textRight': !this.props.fullscreen && !this.props.rtl,
      'u-textLeft': !this.props.fullscreen && this.props.rtl
    });

    return (
      <div
        style={this.props.style}
        className={buttonClasses}>
        {this.props.children}
      </div>
    );
  }
}
