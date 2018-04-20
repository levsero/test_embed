import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { locals as styles } from './Button.scss';

export class Button extends Component {
  static propTypes = {
    className: PropTypes.string,
    disabled: PropTypes.bool,
    fullscreen: PropTypes.bool,
    label: PropTypes.string,
    onClick: PropTypes.func,
    onTouchStartDisabled: PropTypes.bool,
    style: PropTypes.element,
    type: PropTypes.string,
    primary: PropTypes.bool
  };

  static defaultProps = {
    className: '',
    disabled: false,
    fullscreen: false,
    label: '',
    onClick: () => {},
    onTouchStartDisabled: false,
    style: null,
    type: 'submit',
    primary: true
  };

  render = () => {
    const primaryClasses = this.props.primary ? styles.filled : styles.outlined;
    const mobileClasses = this.props.fullscreen ? styles.mobile : '';
    const allowedTypes = /^(submit|button)$/i;
    const type = allowedTypes.test(this.props.type)
      ? this.props.type
      : 'button';

    return (
      <input
        type={type}
        value={this.props.label}
        onClick={this.props.onClick}
        onTouchStart={this.props.onTouchStartDisabled ? null : this.props.onClick}
        disabled={this.props.disabled}
        style={this.props.style}
        className={`${styles.button} ${this.props.className} ${primaryClasses} ${mobileClasses}`} />
    );
  }
}
