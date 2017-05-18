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

const chatLabel = 'embeddable_framework.launcher.label.chat';

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

  componentDidUpdate = (prevProps) => {
    // This is temporary while we're transitioning over to single iframe
    // so that we have a single source for the label and icon rather then
    // handling both in render. Once we're migrated over to redux and removed
    // mediator this can be removed from state and handled in render.
    if (this.props.chatStatus === 'online' && prevProps.chatStatus !== 'online') {
      this.setState({
        label: chatLabel,
        icon: 'Icon--chat'
      });
    } else if (this.props.chatStatus === 'offline' && prevProps.chatStatus !== 'offline') {
      this.setState({
        label: this.props.label,
        icon: 'Icon'
      });
    }
  }

  setLabel = (label, labelOptions = {}) => {
    this.setState({
      label: label,
      labelOptions: labelOptions
    });
  }

  setIcon = (icon) => {
    this.setState({ icon });
  }

  render = () => {
    const showMobileClasses = isMobileBrowser() && !this.state.hasUnreadMessages;
    const iconMobileClasses = showMobileClasses ? styles.iconMobile : '';
    const labelMobileClasses = showMobileClasses ? styles.labelMobile : '';
    const buttonMobileClasses = isMobileBrowser() ? styles.wrapperMobile : '';

    const label = i18n.t(this.state.label, this.state.labelOptions);

    setTimeout( () => this.props.updateFrameSize(5, 0), 0);

    return (
      <div className={`u-userBackgroundColor ${styles.wrapper} ${buttonMobileClasses}`}
        onClick={this.props.onClick}
        onTouchEnd={this.props.onClick}>
        <Icon
          type={this.state.icon}
          className={`${styles.icon} ${iconMobileClasses}`} />
        <span className={`${styles.label} ${labelMobileClasses}`}>{label}</span>
      </div>
    );
  }
}

export default connect(mapStateToProps, {}, null, { withRef: true })(Launcher);
