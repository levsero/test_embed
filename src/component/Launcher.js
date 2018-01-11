import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { locals as styles } from './Launcher.scss';

import { Icon } from 'component/Icon';
import { i18n } from 'service/i18n';
import { isMobileBrowser } from 'utility/devices';
import { getChatAvailable } from 'src/redux/modules/selectors';
import { settings } from 'service/settings';
import { getHelpCenterEmbed, getActiveEmbed } from 'src/redux/modules/base/selectors';
import { isCallbackEnabled, getTalkOnline } from 'src/redux/modules/talk/talk-selectors';

const mapStateToProps = (state) => {
  return {
    activeEmbed: getActiveEmbed(state),
    chatAvailable: getChatAvailable(state),
    helpCenterAvailable: getHelpCenterEmbed(state) && !settings.get('helpCenter.suppress'),
    talkOnline: getTalkOnline(state),
    callbackEnabled: isCallbackEnabled(state)
  };
};

class Launcher extends Component {
  static propTypes = {
    activeEmbed: PropTypes.string.isRequired,
    chatAvailable: PropTypes.bool.isRequired,
    helpCenterAvailable: PropTypes.bool.isRequired,
    talkOnline: PropTypes.bool.isRequired,
    callbackEnabled: PropTypes.bool.isRequired,
    label: PropTypes.string.isRequired,
    onClick: PropTypes.func.isRequired,
    updateFrameSize: PropTypes.func
  };

  static defaultProps = { updateFrameSize: () => {} };

  constructor(props, context) {
    super(props, context);

    this.state = { unreadMessages: 0 };
  }

  setUnreadMessages = (unreadMessages) => {
    this.setState({ unreadMessages });
  }

  getTalkLabel = () => {
    if (this.props.callbackEnabled) {
      return i18n.t(
       'embeddable_framework.launcher.label.talk.request_callback',
       { fallback: i18n.t('embeddable_framework.talk.form.title', { fallback: 'Request a callback' }) }
      );
    } else {
      return i18n.t(
        'embeddable_framework.launcher.label.talk.call_us',
        { fallback: i18n.t('embeddable_framework.talk.phoneOnly.title', { fallback: 'Call us' }) }
      );
    }
  }

  getLabel = () => {
    const { helpCenterAvailable, talkOnline, chatAvailable, label } = this.props;
    const { unreadMessages } = this.state;

    if (unreadMessages) {
      return unreadMessages > 1
           ? i18n.t('embeddable_framework.chat.notification_multiple', { count: unreadMessages })
           : i18n.t('embeddable_framework.chat.notification');
    } else if (chatAvailable && talkOnline) {
      return i18n.t(label);
    } else if (chatAvailable && !helpCenterAvailable) {
      return i18n.t('embeddable_framework.launcher.label.chat');
    } else if (talkOnline && !helpCenterAvailable) {
      return this.getTalkLabel();
    }

    return i18n.t(label);
  }

  getActiveEmbedLabel = () => {
    const { label } = this.props;
    const { unreadMessages } = this.state;

    if (unreadMessages) {
      return unreadMessages > 1
           ? i18n.t('embeddable_framework.chat.notification_multiple', { count: unreadMessages })
           : i18n.t('embeddable_framework.chat.notification');
    }

    switch (this.props.activeEmbed) {
      case 'ticketSubmissionForm':
      case 'helpCenterForm':
        return i18n.t(label);
      case 'chat':
      case 'zopimChat':
        return i18n.t('embeddable_framework.launcher.label.chat');
      case 'talk':
        return this.getTalkLabel();
      default:
        return this.getLabel();
    }
  }

  getIconType = () => {
    const { talkOnline, chatAvailable } = this.props;

    if (chatAvailable && talkOnline) return 'Icon';
    if (chatAvailable) return 'Icon--chat';
    if (talkOnline) return 'Icon--launcher-talk';

    return 'Icon';
  }

  getActiveEmbedIconType = () => {
    switch (this.props.activeEmbed) {
      case 'ticketSubmissionForm':
        return 'Icon';
      case 'chat':
      case 'zopimChat':
        return 'Icon--chat';
      case 'talk':
        return 'Icon--launcher-talk';
      default:
        return this.getIconType();
    }
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
          type={this.getActiveEmbedIconType()}
          className={`${styles.icon} ${iconMobileClasses}`} />
        <span className={`${styles.label} ${labelMobileClasses}`}>{this.getActiveEmbedLabel()}</span>
      </div>
    );
  }
}

export default connect(mapStateToProps, {}, null, { withRef: true })(Launcher);
