import React, { Component, PropTypes } from 'react';
import classNames from 'classnames';
import { locals as styles } from './Launcher.sass';

import { Icon } from 'component/Icon';
import { i18n } from 'service/i18n';
import { isMobileBrowser } from 'utility/devices';

export class Launcher extends Component {
  constructor(props, context) {
    super(props, context);

    this.state = {
      icon: props.icon,
      label: props.label,
      labelOptions: {},
      hasUnreadMessages: false
    };
  }

  setLabel = (label, labelOptions = {}) => {
    this.setState({
      label: label,
      labelOptions: labelOptions
    });
  }

  setIcon = (icon) => {
    this.setState({ icon: icon });
  }

  render = () => {
    const buttonClasses = classNames({
      [`${styles.wrapper}`]: true,
      'u-userBackgroundColor': true,
      [`${styles.wrapperMobile}`]: isMobileBrowser()
    });
    const iconClasses = classNames({
      [`${styles.icon}`]: true,
      [`${styles.iconMobile}`]: isMobileBrowser() && !this.state.hasUnreadMessages
    });
    const labelClasses = classNames({
      [`${styles.label}`]: true,
      [`${styles.labelMobile}`]: isMobileBrowser() && !this.state.hasUnreadMessages
    });
    const label = i18n.t(this.state.label, this.state.labelOptions);

    setTimeout( () => this.props.updateFrameSize(5, 0), 0);

    return (
      <div className={buttonClasses}
        onClick={this.props.onClick}
        onTouchEnd={this.props.onClick}>
        <Icon
          type={this.state.icon}
          className={iconClasses} />
        <span className={labelClasses}>{label}</span>
      </div>
    );
  }
}

Launcher.propTypes = {
  onClick: PropTypes.func.isRequired,
  updateFrameSize: PropTypes.func,
  position: PropTypes.string.isRequired,
  label: PropTypes.string.isRequired,
  icon: PropTypes.string.isRequired
};

Launcher.defaultProps = {
  updateFrameSize: () => {}
};
