import React, { Component, PropTypes } from 'react';
import classNames from 'classnames';

export class ButtonNav extends Component {
  render() {
    const { fullscreen, position, rtl } = this.props;
    const isLeft = (position === 'left');
    const isRight = (position === 'right');
    const buttonClasses = classNames({
      'Button Button--nav u-posAbsolute u-posStart--vertFlush': true,
      'u-posStart--flush u-paddingL': isLeft && !rtl,
      'u-posEnd--flush': isLeft && rtl,
      'u-isActionable u-textSizeBaseMobile': fullscreen,
      'u-posEnd--flush u-paddingR': isRight && !rtl,
      'u-posStart--flush': isRight && rtl,
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

