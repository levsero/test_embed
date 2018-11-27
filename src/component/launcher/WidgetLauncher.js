import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { locals as styles } from './WidgetLauncher.scss';

import { Icon } from 'component/Icon';
import { i18n } from 'service/i18n';
import { isMobileBrowser } from 'utility/devices';
import { getChatAvailable, getTalkAvailable, getChatOfflineAvailable } from 'src/redux/modules/selectors';
import { settings } from 'service/settings';
import { getHelpCenterEmbed, getActiveEmbed } from 'src/redux/modules/base/base-selectors';
import { isCallbackEnabled } from 'src/redux/modules/talk/talk-selectors';
import {
  getNotificationCount } from 'src/redux/modules/chat/chat-selectors';
import { launcherClicked } from 'src/redux/modules/base/';

const mapStateToProps = (state) => {
  return {
    activeEmbed: getActiveEmbed(state),
    chatAvailable: getChatAvailable(state),
    helpCenterAvailable: getHelpCenterEmbed(state) && !settings.get('helpCenter.suppress'),
    talkAvailable: getTalkAvailable(state) && !settings.get('talk.suppress'),
    callbackEnabled: isCallbackEnabled(state),
    notificationCount: getNotificationCount(state),
    chatOfflineAvailable: getChatOfflineAvailable(state)
  };
};

class WidgetLauncher extends Component {
  static propTypes = {
    activeEmbed: PropTypes.string.isRequired,
    chatAvailable: PropTypes.bool.isRequired,
    helpCenterAvailable: PropTypes.bool.isRequired,
    talkAvailable: PropTypes.bool.isRequired,
    callbackEnabled: PropTypes.bool.isRequired,
    label: PropTypes.string.isRequired,
    onClick: PropTypes.func.isRequired,
    notificationCount: PropTypes.number.isRequired,
    getFrameContentDocument: PropTypes.func,
    forceUpdateWorld: PropTypes.func.isRequired,
    updateFrameTitle: PropTypes.func,
    launcherClicked: PropTypes.func.isRequired,
    chatOfflineAvailable: PropTypes.bool.isRequired
  };

  constructor(props, context) {
    super(props, context);

    this.state = { unreadMessages: 0 };
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.notificationCount !== this.props.notificationCount) {
      this.props.forceUpdateWorld();
    }
  }

  setUnreadMessages = (unreadMessages) => {
    this.setState({ unreadMessages });
  }

  getTalkLabel = () => {
    if (this.props.callbackEnabled) {
      return i18n.t('embeddable_framework.launcher.label.talk.request_callback');
    } else {
      return i18n.t('embeddable_framework.launcher.label.talk.call_us');
    }
  }

  getNotificationCount = () => {
    const { unreadMessages } = this.state;
    const { notificationCount } = this.props;

    // TODO: Remove this once mediator is removed
    // Only Zopim or Chat SDK will ever have a value greater than 0 at a given time
    return unreadMessages || notificationCount;
  }

  getLabel = () => {
    const { helpCenterAvailable, talkAvailable, chatAvailable, label } = this.props;
    const notificationCount = this.getNotificationCount();

    if (notificationCount) {
      return notificationCount > 1
        ? i18n.t('embeddable_framework.chat.notification_multiple', { count: notificationCount })
        : i18n.t('embeddable_framework.chat.notification');
    } else if (chatAvailable && talkAvailable) {
      return i18n.t(label);
    } else if (chatAvailable && !helpCenterAvailable) {
      return i18n.t('embeddable_framework.launcher.label.chat');
    } else if (talkAvailable && !helpCenterAvailable) {
      return this.getTalkLabel();
    }

    return i18n.t(label);
  }

  getActiveEmbedLabel = () => {
    const { label } = this.props;
    const notificationCount = this.getNotificationCount();

    if (notificationCount) {
      return notificationCount > 1
        ? i18n.t('embeddable_framework.chat.notification_multiple', { count: notificationCount })
        : i18n.t('embeddable_framework.chat.notification');
    }

    switch (this.props.activeEmbed) {
      case 'ticketSubmissionForm':
      case 'helpCenterForm':
        return i18n.t(label);
      case 'chat':
      case 'zopimChat':
        if (this.props.chatOfflineAvailable) {
          return i18n.t(label);
        }
        if (this.props.chatAvailable) {
          return i18n.t('embeddable_framework.launcher.label.chat');
        }
        return this.getLabel();
      case 'talk':
        return this.getTalkLabel();
      default:
        return this.getLabel();
    }
  }

  getTitle = () => {
    const defaultTitle = i18n.t('embeddable_framework.launcher.frame.title');

    switch (this.props.activeEmbed) {
      case 'chat':
      case 'zopimChat':
        if (this.props.chatAvailable) return i18n.t('embeddable_framework.launcher.chat.title');
        return defaultTitle;
      case 'talk':
        return i18n.t('embeddable_framework.launcher.talk.title');
      default:
        return defaultTitle;
    }
  }

  getIconType = () => {
    const { talkAvailable, chatAvailable, chatOfflineAvailable } = this.props;

    if (chatAvailable && talkAvailable) return 'Icon';
    if (chatAvailable && !chatOfflineAvailable) return 'Icon--chat';
    if (talkAvailable) return 'Icon--launcher-talk';

    return 'Icon';
  }

  getActiveEmbedIconType = () => {
    switch (this.props.activeEmbed) {
      case 'ticketSubmissionForm':
        return 'Icon';
      case 'chat':
      case 'zopimChat':
        if (this.props.chatAvailable && !this.props.chatOfflineAvailable) return 'Icon--chat';
        return this.getIconType();
      case 'talk':
        return 'Icon--launcher-talk';
      default:
        return this.getIconType();
    }
  }

  render = () => {
    const mobile = isMobileBrowser();
    const baseMobileClasses = mobile ? styles.wrapperMobile : '';
    const shouldShowMobileClasses = mobile && !(this.getNotificationCount() > 0);
    const iconMobileClasses = shouldShowMobileClasses ? styles.iconMobile : '';
    const labelMobileClasses = shouldShowMobileClasses ? styles.labelMobile : '';
    const type = this.getActiveEmbedIconType();
    /**
     * - Question mark needs to be flipped in RTL languages except Hebrew: https://zendesk.atlassian.net/browse/CE-4044
     * - Chat icon needs to be flipped in all RTL languages: https://zendesk.atlassian.net/browse/CE-4045
     */
    const locale = i18n.getLocale();
    const isRTL = i18n.isRTL();
    const shouldFlipX = (
      (type === 'Icon' && isRTL && locale !== 'he') ||
      (type === 'Icon--chat' && isRTL)
    );

    if (this.props.updateFrameTitle) {
      this.props.updateFrameTitle(this.getTitle());
    }

    return (
      <button className={`${styles.wrapper} ${baseMobileClasses}`}
        onClick={(e) => { this.props.onClick(e); this.props.launcherClicked(); }}>
        <Icon
          type={type}
          flipX={shouldFlipX}
          className={`${styles.icon} ${iconMobileClasses}`} />
        <span className={`${styles.label} ${labelMobileClasses}`}>{this.getActiveEmbedLabel()}</span>
      </button>
    );
  }
}

const actionCreators = {
  launcherClicked
};

export default connect(mapStateToProps, actionCreators, null, { withRef: true })(WidgetLauncher);
