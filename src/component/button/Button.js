import React, { Component } from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';

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
    const buttonClasses = classNames({
      'c-btn c-btn--medium': true,
      'c-btn--primary u-borderTransparent u-userBackgroundColor': this.props.primary,
      'u-userBorderColor': !this.props.primary,
      'Anim-color u-textNoWrap': true,
      'is-mobile u-sizeFull u-textSizeBaseMobile': this.props.fullscreen,
      [this.props.className]: true
    });
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
        className={buttonClasses} />
    );
  }
}
