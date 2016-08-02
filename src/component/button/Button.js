import React, { Component, PropTypes } from 'react';
import classNames from 'classnames';

import { Icon } from 'component/Icon';
import { i18n } from 'service/i18n';
import { LoadingSpinner } from 'component/Loading';

export class Button extends Component {
  render() {
    const buttonClasses = classNames({
      'c-btn c-btn--medium c-btn--primary': true,
      'Anim-color u-textNoWrap u-borderTransparent u-userBackgroundColor': true,
      'u-sizeFull u-textSizeBaseMobile': this.props.fullscreen,
      [`${this.props.className}`]: true
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

Button.propTypes = {
  label: PropTypes.string.isRequired,
  fullscreen: PropTypes.bool,
  disabled: PropTypes.bool,
  onClick: PropTypes.func,
  type: PropTypes.string,
  className: PropTypes.string,
  style: PropTypes.element
};

Button.defaultProps = {
  fullscreen: false,
  disabled: false,
  onClick: () => {},
  type: 'submit',
  className: '',
  style: null
};

