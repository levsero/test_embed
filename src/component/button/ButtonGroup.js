import React, { Component } from 'react';
import { locals as styles } from './ButtonGroup.scss';
import PropTypes from 'prop-types';

export class ButtonGroup extends Component {
  static propTypes = {
    children: PropTypes.node.isRequired,
    fullscreen: PropTypes.bool,
    rtl: PropTypes.bool,
    style: PropTypes.element,
    containerClasses: PropTypes.string
  };

  static defaultProps = {
    fullscreen: false,
    rtl: false,
    style: null,
    containerClasses: ''
  };

  render = () => {
    const { rtl, fullscreen } = this.props;
    const directionStyles = (rtl) ? styles.buttonLeft : styles.buttonRight;
    const buttonDirectionStyles = (!fullscreen) ? directionStyles : '';
    const buttonClasses = `${styles.container} ${buttonDirectionStyles} ${this.props.containerClasses}`;

    return (
      <div
        style={this.props.style}
        className={buttonClasses}>
        {this.props.children}
      </div>
    );
  }
}
