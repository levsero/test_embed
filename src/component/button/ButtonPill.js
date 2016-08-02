import React, { Component, PropTypes } from 'react';
import classNames from 'classnames';

import { Icon } from 'component/Icon';
import { i18n } from 'service/i18n';

export class ButtonPill extends Component {
  render() {
    const buttonClasses = classNames({
      'c-btn c-btn--medium c-btn--secondary c-btn--pill': true,
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

ButtonPill.propTypes = {
  label: PropTypes.string.isRequired,
  fullscreen: PropTypes.bool,
  showIcon: PropTypes.bool,
  onClick: PropTypes.func
};

ButtonPill.defaultProps = {
  fullscreen: false,
  showIcon: true,
  onClick: () => {}
};

