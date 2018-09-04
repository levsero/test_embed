import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { locals as styles } from './IconFieldButton.scss';

import { Icon } from 'component/Icon';
import classNames from 'classnames';

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

  render = () => {
    const focusedStyles = classNames({
      [styles.focused]: this.props.focused && !this.props.fullscreen,
      [styles.notFocused]: !this.props.fullscreen
    });
    const buttonClasses = classNames(focusedStyles, styles.icon);

    return (
      <Icon onClick={this.props.onClick}
        type={this.props.icon}
        className={buttonClasses} />
    );
  }
}
