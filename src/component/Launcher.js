import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { locals as styles } from './Launcher.sass';

import { Icon } from 'component/Icon';
import { i18n } from 'service/i18n';
import { isMobileBrowser } from 'utility/devices';
import { getChatStatus } from 'src/redux/modules/chat/selectors';
import { getZopimChatStatus } from 'src/redux/modules/zopimChat/selectors';
import { getZopimChatEmbed } from 'src/redux/modules/base/selectors';

const mapStateToProps = (state) => {
  // If zopimChat is a seperate embed we're using old chat. New chat is contained in WebWidget.
  const chatStatus = getZopimChatEmbed(state) ? getZopimChatStatus(state) : getChatStatus(state);

  return { chatStatus };
};

class Launcher extends Component {
  static propTypes = {
    chatStatus: PropTypes.string,
    icon: PropTypes.string.isRequired,
    label: PropTypes.string.isRequired,
    onClick: PropTypes.func.isRequired,
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
      this.setState({ label, labelOptions });
    }
  }

  render = () => {
    const mobile = isMobileBrowser();
    const baseMobileClasses = mobile ? styles.wrapperMobile : '';
    const shouldShowMobileClasses = mobile && !this.state.hasUnreadMessages;
    const iconMobileClasses = shouldShowMobileClasses ? styles.iconMobile : '';
    const labelMobileClasses = shouldShowMobileClasses ? styles.labelMobile : '';

    const chatOnline = this.props.chatStatus === 'online';
    const label = chatOnline
                ? i18n.t('embeddable_framework.launcher.label.chat')
                : i18n.t(this.state.label, this.state.labelOptions);
    const icon = chatOnline ? 'Icon--chat' : 'Icon';

    setTimeout(() => this.props.updateFrameSize(5, 0), 0);

    return (
      <div className={`${styles.wrapper} ${baseMobileClasses}`}
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
