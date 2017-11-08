import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { locals as styles } from './ButtonSecondary.sass';

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
    const buttonClasses = `${styles.button} ${this.props.className}`;

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
