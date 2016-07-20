import React, { Component, PropTypes } from 'react';
import classNames from 'classnames';

import { Icon } from 'component/Icon';

export class IconFieldButton extends Component {
  render() {
    const { fullscreen } = this.props;
    const buttonClasses = classNames({
      'Button--field u-borderTransparent u-marginLS': true,
      'Button--fieldMobile Anim-color': fullscreen,
      'Button--fieldDesktop': !fullscreen,
      [`${this.props.className}`]: true
    });

    return (
      <div
        onClick={this.props.onClick}
        onTouchStart={this.props.onClick}
        className={buttonClasses}>
        <Icon type={this.props.icon} className='u-paddingLN' />
      </div>
    );
  }
}

IconFieldButton.propTypes = {
  onClick: PropTypes.func,
  icon: PropTypes.string,
  className: PropTypes.string,
  fullscreen: PropTypes.bool
};

IconFieldButton.defaultProps = {
  onClick: () => {},
  icon: '',
  className: '',
  fullscreen: false
};

