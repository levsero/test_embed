import React, { Component, PropTypes } from 'react';
import classNames from 'classnames';

import { Icon } from 'component/Icon';
import { i18n } from 'service/i18n';

export class ButtonIcon extends Component {
  render() {
    const buttonClasses = classNames({
      'c-btn c-btn--medium c-btn--primary': true,
      'Anim-color u-textNoWrap u-borderTransparent': true,
      'u-sizeFull u-textSizeBaseMobile': this.props.fullscreen,
      [`${this.props.className}`]: true
    });

    const icon = this.props.showIcon ? <Icon type='Icon--link' /> : null;
    return (
      <div
        onClick={this.props.onClick}
        onTouchStart={this.props.onClick}
        className={buttonClasses}>
        <Icon
          type={this.props.icon} />
        <div>{this.props.label}</div>
      </div>
    );
  }
}

ButtonIcon.propTypes = {
  label: PropTypes.string,
  onClick: PropTypes.func,
  className: PropTypes.string
};

ButtonIcon.defaultProps = {
  label: '',
  onClick: () => {},
  className: ''
};

