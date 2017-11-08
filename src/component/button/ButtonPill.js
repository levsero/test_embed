import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { locals as styles } from './ButtonPill.sass';

import { Icon } from 'component/Icon';
import { i18n } from 'service/i18n';

export class ButtonPill extends Component {
  static propTypes = {
    fullscreen: PropTypes.bool,
    label: PropTypes.string.isRequired,
    onClick: PropTypes.func,
    showIcon: PropTypes.bool
  };

  static defaultProps = {
    fullscreen: false,
    onClick: () => {},
    showIcon: true
  };

  render = () => {
    const screenStyles = this.props.fullscreen ? styles.fullscreen : '';
    const directionStyles = i18n.isRTL() ? styles.rtl : '';
    const buttonClasses = `
      ${styles.pill}
      ${screenStyles}
      ${directionStyles}
    `;
    const icon = this.props.showIcon ? <Icon type='Icon--link' /> : null;

    return (
      <div
        onClick={this.props.onClick}
        className={buttonClasses}>
        {this.props.label}
        {icon}
      </div>
    );
  }
}
