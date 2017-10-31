import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { locals as styles } from './ButtonIcon.sass';

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
    const { className, fullscreen, position, rtl } = this.props;
    const isLeft = (position === 'left');
    const isRight = (position === 'right');
    const fullscreenStyle = (fullscreen) ? styles.fullscreen : '';
    const directionStyle = (rtl) ? styles.rtl : '';
    let positionStyle;

    if (isLeft) {
      positionStyle = (rtl) ? styles.leftRtl : styles.left;
    }
    if (isRight) {
      positionStyle = (rtl) ? styles.rightRtl : styles.right;
    }

    const buttonClasses = `
      ${styles.button}
      ${fullscreenStyle}
      ${positionStyle}
      ${directionStyle}
      ${className}
    `;

    return (
      <div className={styles.container}>
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
