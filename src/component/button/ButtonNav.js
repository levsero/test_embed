import React, { Component, PropTypes } from 'react';
import classNames from 'classnames';
import Dropzone from 'react-dropzone';

import { Icon } from 'component/Icon';
import { i18n } from 'service/i18n';
import { LoadingSpinner } from 'component/Loading';

export class ButtonNav extends Component {
  render() {
    const { fullscreen, position, rtl } = this.props;
    const isLeft = (position === 'left');
    const isRight = (position === 'right');
    const buttonClasses = classNames({
      'Button Button--nav u-posAbsolute u-posStart--vertFlush': true,
      'u-posStart u-paddingL': isLeft && !rtl,
      'u-posEnd': isLeft && rtl,
      'u-posEnd--flush': (isLeft && rtl && fullscreen) || (isRight && !rtl && fullscreen),
      'u-isActionable u-textSizeBaseMobile': fullscreen,
      'u-posEnd u-paddingR': isRight && !rtl,
      'u-posStart': isRight && rtl,
      'u-posStart--flush': (isRight && rtl && fullscreen) || (isLeft && !rtl && fullscreen),
      'u-flipText': rtl
    });

    return (
      <div className='u-posRelative u-zIndex1'>
        <div
          onClick={this.props.onClick}
          onTouchStart={this.props.onClick}
          className={buttonClasses}>
          {this.props.label}
        </div>
      </div>
    );
  }
}

ButtonNav.propTypes = {
  label: PropTypes.element.isRequired,
  rtl: PropTypes.bool,
  fullscreen: PropTypes.bool,
  position: PropTypes.string,
  onClick: PropTypes.func
};

ButtonNav.defaultProps = {
  rtl: false,
  fullscreen: false,
  position: 'left',
  onClick: () => {}
};

