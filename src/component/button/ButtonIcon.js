import React, { Component } from 'react';
import PropTypes from 'prop-types';

import { Icon } from 'component/Icon';
import { isIE } from 'utility/devices';
import { locals as styles } from './ButtonIcon.sass';

export class ButtonIcon extends Component {
  static propTypes = {
    actionable: PropTypes.bool,
    className: PropTypes.string,
    labelClassName: PropTypes.string,
    icon: PropTypes.string,
    label: PropTypes.string,
    onClick: PropTypes.func
  };

  static defaultProps = {
    actionable: true,
    className: '',
    labelClassName: '',
    icon: '',
    label: '',
    onClick: () => {}
  };

  render = () => {
    const { actionable, onClick, className, labelClassName, icon, label } = this.props;
    const actionableStyles = actionable ? styles.containerActionable : '';
    const ieStyles = isIE() ? styles.containerIE : '';
    const buttonClasses = `
      ${styles.container}
      ${actionableStyles}
      ${ieStyles}
    `;

    return (
      <div
        onClick={onClick}
        className={`${buttonClasses} ${className}`}>
        <Icon
          className={styles.icon}
          type={icon} />
        <span className={`${styles.label} ${labelClassName}`}>
          {label}
        </span>
      </div>
    );
  }
}
