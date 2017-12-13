import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { locals as styles } from './Launcher.sass';

import { Icon } from 'component/Icon';
import { i18n } from 'service/i18n';
import { isMobileBrowser } from 'utility/devices';
import { getChatStatus } from 'src/redux/modules/chat/selectors';
import { getZopimChatStatus } from 'src/redux/modules/zopimChat/selectors';
import { settings } from 'service/settings';
import { getZopimChatEmbed,
         getHelpCenterEmbed,
         getTalkEmbed } from 'src/redux/modules/base/selectors';
import { isCallbackEnabled } from 'src/redux/modules/talk/talk-selectors';

const mapStateToProps = (state) => {
  const chatStatus = getZopimChatEmbed(state) ? getZopimChatStatus(state) : getChatStatus(state);

  return {
    chatStatus,
    helpCenterAvailable: getHelpCenterEmbed(state) && !settings.get('helpCenter.suppress'),
    talkAvailable: getTalkEmbed(state),
    callbackEnabled: isCallbackEnabled(state)
  };
};

class Launcher extends Component {
  static propTypes = {
    chatStatus: PropTypes.string.isRequired,
    helpCenterAvailable: PropTypes.bool.isRequired,
    talkAvailable: PropTypes.bool.isRequired,
    callbackEnabled: PropTypes.bool.isRequired,
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
    const { helpCenterAvailable, talkAvailable, callbackEnabled, label } = this.props;
    const { unreadMessages } = this.state;
    const chatAvailable = this.chatAvailable();
    const talkLabel = (callbackEnabled)
      ? i18n.t(
          'embeddable_framework.launcher.label.talk.request_callback',
          { fallback: i18n.t('embeddable_framework.talk.form.title', { fallback: 'Request a callback' }) })
      : i18n.t(
          'embeddable_framework.launcher.label.talk.call_us',
          { fallback: i18n.t('embeddable_framework.talk.phoneOnly.title', { fallback: 'Call us' }) });

    if (unreadMessages) {
      return unreadMessages > 1
           ? i18n.t('embeddable_framework.chat.notification_multiple', { count: unreadMessages })
           : i18n.t('embeddable_framework.chat.notification');
    } else if (chatAvailable && talkAvailable) {
      return i18n.t(label);
    } else if (chatAvailable && !helpCenterAvailable) {
      return i18n.t('embeddable_framework.launcher.label.chat');
    } else if (talkAvailable) {
      return talkLabel;
    }

    return i18n.t(label);
  }

  getIconType = () => {
    let { chatStatus, talkAvailable } = this.props;

    if (chatStatus === 'online' && talkAvailable) return 'Icon';
    if (chatStatus === 'online') return 'Icon--chat';
    if (talkAvailable) return 'Icon--talk';

    return 'Icon';
  }

  render = () => {
    const mobile = isMobileBrowser();
    const baseMobileClasses = mobile ? styles.wrapperMobile : '';
    const shouldShowMobileClasses = mobile && !this.state.unreadMessages > 0;
    const iconMobileClasses = shouldShowMobileClasses ? styles.iconMobile : '';
    const labelMobileClasses = shouldShowMobileClasses ? styles.labelMobile : '';

    setTimeout(() => this.props.updateFrameSize(5, 0), 0);

    return (
      <div className={`${styles.wrapper} ${baseMobileClasses}`}
        onClick={this.props.onClick}
        onTouchEnd={this.props.onClick}>
        <Icon
          type={this.getIconType()}
          className={`${styles.icon} ${iconMobileClasses}`} />
        <span className={`${styles.label} ${labelMobileClasses}`}>{this.getLabel()}</span>
      </div>
    );
  }
}

export default connect(mapStateToProps, {}, null, { withRef: true })(Launcher);
