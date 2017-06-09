import React, { Component } from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';

import { Icon } from 'component/Icon';
import { isIE } from 'utility/devices';
import { locals as styles } from './ButtonIcon.sass'

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
    let buttonClasses = `${styles.container}`;

    if (actionable) {
      buttonClasses = `${buttonClasses} ${styles['container--actionable']}`;
    }

    if (isIE()) {
      buttonClasses = `${buttonClasses} ${styles['container--ie']}`;
    }

    console.log(className);

    return (
      <div
        onClick={onClick}
        onTouchStart={onClick}
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
