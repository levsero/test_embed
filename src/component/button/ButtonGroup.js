import React, { Component } from 'react';
import PropTypes from 'prop-types';

import { locals as styles } from './ButtonGroup.sass';

export class ButtonGroup extends Component {
  static propTypes = {
    children: PropTypes.node.isRequired,
    fullscreen: PropTypes.bool,
    rtl: PropTypes.bool,
    className: PropTypes.string
  };

  static defaultProps = {
    fullscreen: false,
    rtl: false,
    className: ''
  };

  render = () => {
    const directionalStyle = (this.props.rtl) ? styles.rtl : styles.ltr;
    const applyDirectionalStyle = (!this.props.fullscreen) ? directionalStyle : '';
    const buttonClasses = `
      ButtonGroup
      ${this.props.className}
      ${applyDirectionalStyle}
    `;

    return (
      <div className={buttonClasses}>
        {this.props.children}
      </div>
    );
  }
}
