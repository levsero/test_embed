import React, { Component, PropTypes } from 'react';
import classNames from 'classnames';

import { Icon } from 'component/Icon';
import { i18n } from 'service/i18n';

export class ButtonPill extends Component {
  static propTypes = {
    fullscreen: PropTypes.bool,
    label: PropTypes.string.isRequired,
    onClick: PropTypes.func,
    showIcon: PropTypes.bool
  };

  static defaultProps = {
    fullscreen: false,
    onClick: () => {},
    showIcon: true
  };

  render = () => {
    const buttonClasses = classNames({
      'c-btn c-btn--secondary c-btn--pill': true,
      'u-textNormal': true,
      'u-sizeFull u-textSizeBaseMobile is-mobile': this.props.fullscreen,
      'u-textNoWrap': i18n.isRTL()
    });
    const icon = this.props.showIcon ? <Icon type='Icon--link' /> : null;

    return (
      <div
        onClick={this.props.onClick}
        className={buttonClasses}>
        {this.props.label}
        {icon}
      </div>
    );
  }
}
