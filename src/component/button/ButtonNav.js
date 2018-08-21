import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { locals as styles } from './ButtonNav.scss';

export class ButtonNav extends Component {
  static propTypes = {
    className: PropTypes.string,
    fullscreen: PropTypes.bool,
    label: PropTypes.element.isRequired,
    onClick: PropTypes.func,
    position: PropTypes.string,
    rtl: PropTypes.bool,
    'aria-label': PropTypes.string.isRequired
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
    const fullscreenStyles = (fullscreen) ? styles.fullscreen : styles.desktop;
    const directionStyles = (rtl) ? styles.rtl : '';
    const buttonStyles = styles.button;
    let positionStyles;

    if (isLeft) {
      positionStyles = (rtl) ? styles.leftRtl : styles.left;
    }
    if (isRight) {
      positionStyles = (rtl) ? styles.rightRtl : styles.right;
    }

    const buttonClasses = `
      ${buttonStyles}
      ${fullscreenStyles}
      ${positionStyles}
      ${directionStyles}
      ${className}
    `;

    return (
      <div className={styles.container}>
        <button
          onClick={this.props.onClick}
          aria-label={this.props['aria-label']}
          className={buttonClasses}>
          {this.props.label}
        </button>
      </div>
    );
  }
}
