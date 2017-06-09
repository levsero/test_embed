import React, { Component } from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';

import { Icon } from 'component/Icon';
import { isIE } from 'utility/devices';

export class ButtonIcon extends Component {
  static propTypes = {
    className: PropTypes.string,
    labelClassName: PropTypes.string,
    icon: PropTypes.string,
    label: PropTypes.string,
    onClick: PropTypes.func
  };

  static defaultProps = {
    className: '',
    labelClassName: '',
    icon: '',
    label: '',
    onClick: () => {}
  };

  render = () => {
    const buttonClasses = classNames({
      'Button--icon u-isActionable': true,
      'u-flex': !isIE(),
      'u-paddingBXL': isIE(),
      [this.props.className]: true
    });
    const labelClasses = `u-pullLeft u-textSizeNml ${this.props.labelClassName}`;

    return (
      <div
        onClick={this.props.onClick}
        onTouchStart={this.props.onClick}
        className={buttonClasses}>
        <Icon
          className='Icon--form Arrange-sizeFit u-pullLeft u-paddingRM'
          type={this.props.icon} />
        <span className={labelClasses}>
          {this.props.label}
        </span>
      </div>
    );
  }
}
