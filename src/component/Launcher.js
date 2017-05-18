import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { locals as styles } from './Launcher.sass';

import { Icon } from 'component/Icon';
import { i18n } from 'service/i18n';
import { isMobileBrowser } from 'utility/devices';

const mapStateToProps = (state) => {
  return { chatStatus: state.chat.account_status };
};

class Launcher extends Component {
  static propTypes = {
    chatStatus: PropTypes.string,
    icon: PropTypes.string.isRequired,
    label: PropTypes.string.isRequired,
    onClick: PropTypes.func.isRequired,
    position: PropTypes.string.isRequired,
    updateFrameSize: PropTypes.func
  };

  static defaultProps = {
    chatStatus: '',
    updateFrameSize: () => {}
  };

  constructor(props, context) {
    super(props, context);

    this.state = {
      hasUnreadMessages: false,
      icon: props.icon,
      label: props.label,
      labelOptions: {}
    };
  }

  setLabel = (label, labelOptions = {}) => {
    if (this.props.chatStatus !== 'online') {
      this.setState({
        label: label,
        labelOptions: labelOptions
      });
    }
  }

  setIcon = (icon) => {
    if (this.props.chatStatus !== 'online') {
      this.setState({ icon });
    }
  }

  render = () => {
    const showMobileClasses = isMobileBrowser() && !this.state.hasUnreadMessages;
    const iconMobileClasses = showMobileClasses ? styles.iconMobile : '';
    const labelMobileClasses = showMobileClasses ? styles.labelMobile : '';
    const buttonMobileClasses = isMobileBrowser() ? styles.wrapperMobile : '';

    const label = this.props.chatStatus !== 'online'
                ? i18n.t(this.state.label, this.state.labelOptions)
                : i18n.t('embeddable_framework.launcher.label.chat');
    const icon = this.props.chatStatus !== 'online'
               ? this.state.icon
               : 'Icon--chat';

    setTimeout(() => this.props.updateFrameSize(5, 0), 0);

    return (
      <div className={`u-userBackgroundColor ${styles.wrapper} ${buttonMobileClasses}`}
        onClick={this.props.onClick}
        onTouchEnd={this.props.onClick}>
        <Icon
          type={icon}
          className={`${styles.icon} ${iconMobileClasses}`} />
        <span className={`${styles.label} ${labelMobileClasses}`}>{label}</span>
      </div>
    );
  }
}

export default connect(mapStateToProps, {}, null, { withRef: true })(Launcher);
