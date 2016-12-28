import React, { Component, PropTypes } from 'react';
import classNames from 'classnames';

import { Icon } from 'component/Icon';
import { isIE } from 'utility/devices';

export class ButtonIcon extends Component {
  static propTypes = {
    className: PropTypes.string,
    icon: PropTypes.string,
    label: PropTypes.string,
    onClick: PropTypes.func
  };

  static defaultProps = {
    className: '',
    icon: '',
    label: '',
    onClick: () => {}
  };

  render = () => {
    const buttonClasses = classNames({
      'Button--icon u-userFillColor u-isActionable': true,
      'u-flex': !isIE(),
      'u-paddingBXL': isIE()
    });

    return (
      <div
        onClick={this.props.onClick}
        onTouchStart={this.props.onClick}
        className={buttonClasses}>
        <Icon
          className='Icon--form Arrange-sizeFit u-pullLeft u-paddingRM'
          type={this.props.icon} />
        <span className='u-pullLeft u-textSizeNml'>
          {this.props.label}
        </span>
      </div>
    );
  }
}
