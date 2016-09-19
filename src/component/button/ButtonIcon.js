import React, { Component, PropTypes } from 'react';
import classNames from 'classnames';

import { Icon } from 'component/Icon';
import { i18n } from 'service/i18n';

export class ButtonIcon extends Component {
  render() {
    const buttonClasses = classNames({
      'c-btn c-btn--secondary u-userFillColor u-paddingTM': true,
      'Anim-color u-textNoWrap u-borderTransparent u-paddingBXL': true,
      [`${this.props.className}`]: true
    });

    return (
      <div
        onClick={this.props.onClick}
        onTouchStart={this.props.onClick}
        className={buttonClasses}>
        <Icon
          className='u-pullLeft Arrange-sizeFit'
          type={this.props.icon} />
        <span className='u-pullLeft u-textSizeNml u-textNormal u-alignMiddle'>
          {this.props.label}
        </span>
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

