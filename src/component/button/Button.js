import React, { Component, PropTypes } from 'react';
import classNames from 'classnames';

export class Button extends Component {
  static propTypes = {
    className: PropTypes.string,
    disabled: PropTypes.bool,
    fullscreen: PropTypes.bool,
    label: PropTypes.string,
    onClick: PropTypes.func,
    style: PropTypes.element,
    type: PropTypes.string
  };

  static defaultProps = {
    className: '',
    disabled: false,
    fullscreen: false,
    label: '',
    onClick: () => {},
    style: null,
    type: 'submit'
  };

  render = () => {
    const buttonClasses = classNames({
      'c-btn c-btn--medium c-btn--primary': true,
      'Anim-color u-textNoWrap u-borderTransparent u-userBackgroundColor': true,
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
        onTouchStart={this.props.onClick}
        disabled={this.props.disabled}
        style={this.props.style}
        className={buttonClasses} />
    );
  }
}
