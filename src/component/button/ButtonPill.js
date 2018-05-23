import React, { Component } from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';

import { Icon } from 'component/Icon';
import { i18n } from 'service/i18n';

import { locals as styles } from './ButtonPill.scss';

export class ButtonPill extends Component {
  static propTypes = {
    fullscreen: PropTypes.bool,
    label: PropTypes.string.isRequired,
    classname: PropTypes.string,
    onClick: PropTypes.func,
    showIcon: PropTypes.bool
  };

  static defaultProps = {
    fullscreen: false,
    onClick: () => {},
    showIcon: false,
    classname: ''
  };

  render = () => {
    const { classname, fullscreen, showIcon, onClick, label } = this.props;
    const buttonStyles = classNames(styles.pill, classname, {
      [styles.fullscreen]: fullscreen,
      [styles.rtl]: i18n.isRTL()
    });

    const icon = (showIcon) ? <Icon type='Icon--arrow-down' /> : null;

    return (
      <div
        onClick={onClick}
        className={buttonStyles}>
        {label}
        {icon}
      </div>
    );
  }
}
