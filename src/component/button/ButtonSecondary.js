import React, { Component, PropTypes } from 'react';
import classNames from 'classnames';
import Dropzone from 'react-dropzone';

import { Icon } from 'component/Icon';
import { i18n } from 'service/i18n';
import { LoadingSpinner } from 'component/Loading';

export class ButtonSecondary extends Component {
  render() {
    const buttonClasses = classNames({
      'c-btn c-btn--medium c-btn--secondary': true,
      [this.props.className]: true
    });

    return (this.props.disabled)
         ? <div
             className={buttonClasses}
             style={this.props.style}
             disabled={true}>
             {this.props.label}
           </div>
         : <div
             onClick={this.props.onClick}
             onTouchStart={this.props.onClick}
             className={buttonClasses}
             style={this.props.style}>
             {this.props.label}
           </div>;
  }
}

ButtonSecondary.propTypes = {
  label: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.element
  ]).isRequired,
  disabled: PropTypes.bool,
  className: PropTypes.string,
  style: PropTypes.element,
  onClick: PropTypes.func
};

ButtonSecondary.defaultProps = {
  disabled: false,
  className: '',
  style: null,
  onClick: () => {}
};

