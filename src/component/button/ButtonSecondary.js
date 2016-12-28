import React, { Component, PropTypes } from 'react';
import classNames from 'classnames';

export class ButtonSecondary extends Component {
  static propTypes = {
    label: PropTypes.oneOfType([
      PropTypes.element,
      PropTypes.string
    ]).isRequired,
    className: PropTypes.string,
    disabled: PropTypes.bool,
    onClick: PropTypes.func,
    style: PropTypes.element
  };

  static defaultProps = {
    className: '',
    disabled: false,
    onClick: () => {},
    style: null
  };

  render = () => {
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
