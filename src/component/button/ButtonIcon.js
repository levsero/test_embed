import React, { Component } from 'react';
import PropTypes from 'prop-types';

import { Icon } from 'component/Icon';
import { locals as styles } from './ButtonIcon.scss';

export class ButtonIcon extends Component {
  static propTypes = {
    actionable: PropTypes.bool,
    className: PropTypes.string,
    labelClassName: PropTypes.string,
    icon: PropTypes.string,
    iconClasses: PropTypes.string,
    label: PropTypes.node,
    onClick: PropTypes.func
  };

  static defaultProps = {
    actionable: true,
    className: '',
    labelClassName: '',
    icon: '',
    iconClasses: '',
    label: null,
    onClick: () => {}
  };

  handleOnClick = () => {
    if (this.props.actionable) {
      this.props.onClick();
    }
  }

  render = () => {
    const { actionable, className, labelClassName, icon, label } = this.props;
    const actionableStyles = actionable ? styles.containerActionable : '';
    const buttonClasses = `
      ${styles.container}
      ${actionableStyles}
    `;

    return (
      <div
        onClick={this.handleOnClick}
        className={`${buttonClasses} ${className}`}>
        <Icon
          className={`${styles.icon} ${this.props.iconClasses}`}
          type={icon} />
        <span className={`${styles.label} ${labelClassName}`}>
          {label}
        </span>
      </div>
    );
  }
}
