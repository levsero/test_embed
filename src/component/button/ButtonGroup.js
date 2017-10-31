import React, { Component } from 'react';
import { locals as styles } from './ButtonGroup.sass';
import PropTypes from 'prop-types';

export class ButtonGroup extends Component {
  static propTypes = {
    children: PropTypes.node.isRequired,
    fullscreen: PropTypes.bool,
    rtl: PropTypes.bool,
    style: PropTypes.element
  };

  static defaultProps = {
    fullscreen: false,
    rtl: false,
    style: null
  };

  render = () => {
    const { rtl, fullscreen } = this.props;
    const directionStyle = (rtl) ? styles.buttonLeft : styles.buttonRight;
    const buttonDirectionStyle = (!fullscreen) ? directionStyle : '';

    const buttonClasses = `${styles.container} ${buttonDirectionStyle}`;

    return (
      <div
        style={this.props.style}
        className={buttonClasses}>
        {this.props.children}
      </div>
    );
  }
}
