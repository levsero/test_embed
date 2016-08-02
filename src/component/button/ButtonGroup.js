import React, { Component, PropTypes } from 'react';
import classNames from 'classnames';

import { Icon } from 'component/Icon';
import { i18n } from 'service/i18n';
import { LoadingSpinner } from 'component/Loading';

export class ButtonGroup extends Component {
  render() {
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

ButtonGroup.propTypes = {
  children: PropTypes.node.isRequired,
  rtl: PropTypes.bool,
  fullscreen: PropTypes.bool,
  style: PropTypes.element
};

ButtonGroup.defaultProps = {
  rtl: false,
  fullscreen: false,
  style: null
};

