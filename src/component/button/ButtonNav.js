import React, { Component, PropTypes } from 'react';
import classNames from 'classnames';

export class ButtonNav extends Component {
  static propTypes = {
    className: PropTypes.string,
    fullscreen: PropTypes.bool,
    label: PropTypes.element.isRequired,
    onClick: PropTypes.func,
    position: PropTypes.string,
    rtl: PropTypes.bool
  };

  static defaultProps = {
    className: '',
    fullscreen: false,
    onClick: () => {},
    position: 'left',
    rtl: false
  };

  render = () => {
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
      'u-flipText': rtl,
      [this.props.className]: true
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
