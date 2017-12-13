import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { locals as styles } from './Launcher.sass';

import { Icon } from 'component/Icon';
import { i18n } from 'service/i18n';
import { isMobileBrowser } from 'utility/devices';
import { getChatStatus } from 'src/redux/modules/chat/selectors';
import { getZopimChatStatus } from 'src/redux/modules/zopimChat/selectors';
import { getZopimChatEmbed,
         getHelpCenterEmbed } from 'src/redux/modules/base/selectors';
import { settings } from 'service/settings';

const mapStateToProps = (state) => {
  const chatStatus = getZopimChatEmbed(state) ? getZopimChatStatus(state) : getChatStatus(state);

  return {
    chatStatus,
    helpCenterAvailable: getHelpCenterEmbed(state) && !settings.get('helpCenter.suppress')
  };
};

class Launcher extends Component {
  static propTypes = {
    chatStatus: PropTypes.string.isRequired,
    helpCenterAvailable: PropTypes.bool.isRequired,
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
      unreadMessages: 0,
      overrideChatSuppress: false
    };
  }

  setUnreadMessages = (unreadMessages) => {
    this.setState({
      unreadMessages,
      overrideChatSuppress: true
    });
  }

  chatAvailable = () => {
    const { chatStatus } = this.props;
    const chatOnline = chatStatus === 'online' || chatStatus === 'away';
    const chatSuppressed = settings.get('chat.suppress') && !this.state.overrideChatSuppress;

    return chatOnline && !chatSuppressed;
  }

  getLabel = () => {
    const { helpCenterAvailable } = this.props;
    const { unreadMessages } = this.state;

    if (unreadMessages) {
      return unreadMessages > 1
           ? i18n.t('embeddable_framework.chat.notification_multiple', { count: unreadMessages })
           : i18n.t('embeddable_framework.chat.notification');
    } else if (this.chatAvailable() && !helpCenterAvailable) {
      return i18n.t('embeddable_framework.launcher.label.chat');
    }

    return i18n.t(this.props.label);
  }

  render = () => {
    const mobile = isMobileBrowser();
    const baseMobileClasses = mobile ? styles.wrapperMobile : '';
    const shouldShowMobileClasses = mobile && !this.state.unreadMessages > 0;
    const iconMobileClasses = shouldShowMobileClasses ? styles.iconMobile : '';
    const labelMobileClasses = shouldShowMobileClasses ? styles.labelMobile : '';
    const icon = this.chatAvailable() ? 'Icon--chat' : 'Icon';

    setTimeout(() => this.props.updateFrameSize(5, 0), 0);

    return (
      <div className={`${styles.wrapper} ${baseMobileClasses}`}
        onClick={this.props.onClick}
        onTouchEnd={this.props.onClick}>
        <Icon
          type={icon}
          className={`${styles.icon} ${iconMobileClasses}`} />
        <span className={`${styles.label} ${labelMobileClasses}`}>{this.getLabel()}</span>
      </div>
    );
  }
}

export default connect(mapStateToProps, {}, null, { withRef: true })(Launcher);
