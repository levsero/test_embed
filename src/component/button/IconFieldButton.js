import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { locals as styles } from './IconFieldButton.sass';

import { Icon } from 'component/Icon';

export class IconFieldButton extends Component {
  static propTypes = {
    className: PropTypes.string,
    focused: PropTypes.bool,
    fullscreen: PropTypes.bool,
    icon: PropTypes.string,
    onClick: PropTypes.func
  };

  static defaultProps = {
    className: '',
    focused: false,
    fullscreen: false,
    icon: '',
    onClick: () => {}
  };

  constructor(props, context) {
    super(props, context);

    this.state = { hovering: false };
  }

  handleMouseEnter = () => {
    this.setState({ hovering: true });
  }

  handleMouseLeave = () => {
    this.setState({ hovering: false });
  }

  render = () => {
    const { fullscreen, focused, className } = this.props;
    const userFillColorStyles = this.state.hovering && !fullscreen ? styles.hovering : '';
    const fullScreenStyles = fullscreen ? styles.fullscreen : '';
    const focusedStyles = focused ? styles.focused : styles.notFocused;
    const notFullScreenStyles = !fullscreen ? focusedStyles : '';
    const buttonClasses = `
      ${styles.button}
      ${userFillColorStyles}
      ${notFullScreenStyles}
      ${fullScreenStyles}
      ${className}
    `;

    return (
      <div
        onClick={this.props.onClick}
        onTouchStart={this.props.onClick}
        onMouseEnter={this.handleMouseEnter}
        onMouseLeave={this.handleMouseLeave}
        className={buttonClasses}>
        <Icon type={this.props.icon} className={styles.icon} />
      </div>
    );
  }
}
