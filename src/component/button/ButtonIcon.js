import React, { Component, PropTypes } from 'react';
import classNames from 'classnames';

import { Icon } from 'component/Icon';
import { isIE } from 'utility/devices';

export class ButtonIcon extends Component {
  render() {
    const buttonClasses = classNames({
      'Button--icon u-userFillColor u-isActionable': true,
      'u-displayFlex': !isIE(),
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

ButtonIcon.propTypes = {
  label: PropTypes.string,
  onClick: PropTypes.func,
  icon: PropTypes.string,
  className: PropTypes.string
};

ButtonIcon.defaultProps = {
  onClick: () => {},
  label: '',
  icon: '',
  className: ''
};

