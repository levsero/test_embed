import React, { Component } from 'react';
import PropTypes from 'prop-types';

import { Avatar } from 'component/Avatar';
import { ChatPopup } from 'component/chat/ChatPopup';
import { i18n } from 'service/i18n';

import { locals as styles } from './ChatNotificationPopup.scss';
import classNames from 'classnames';

export class ChatNotificationPopup extends Component {
  static propTypes = {
    className: PropTypes.string,
    isMobile: PropTypes.bool,
    notification: PropTypes.object.isRequired,
    shouldShow: PropTypes.bool.isRequired,
    chatNotificationDismissed: PropTypes.func.isRequired,
    chatNotificationRespond: PropTypes.func.isRequired
  }

  static defaultProps = {
    className: '',
    isMobile: false
  }

  constructor() {
    super();

    this.agentMessage = null;
  }

  renderAgentName = (agentName) => {
    if (agentName === '') return null;

    return <div className={styles.agentName}>{agentName}</div>;
  }

  renderAgentMessage = (message) => {
    const { scrollHeight, clientHeight } = this.agentMessage || {};
    const className = this.agentMessage && (scrollHeight > clientHeight)
      ? `${styles.agentMessage} ${styles.agentMessageOverflow}`
      : styles.agentMessage;

    return (
      <div ref={(el) => this.agentMessage = el} className={className}>
        {message}
      </div>
    );
  }

  renderProactiveContent = () => {
    const { avatar_path: avatarPath, display_name, proactive, msg } = this.props.notification; // eslint-disable-line camelcase
    const agentName = proactive ? display_name : ''; // eslint-disable-line camelcase
    const avatarClasses = proactive ? styles.proactiveAvatar : styles.avatar;

    return (
      <div className={styles.proactiveContainer}>
        <Avatar className={avatarClasses} src={avatarPath} fallbackIcon="Icon--avatar" />
        <div className={styles.agentContainer}>
          {this.renderAgentName(agentName)}
          {this.renderAgentMessage(msg)}
        </div>
      </div>
    );
  }

  render = () => {
    const { notification, shouldShow, chatNotificationDismissed, chatNotificationRespond, isMobile } = this.props;
    const { proactive } = notification;
    const className = classNames({
      [styles.ongoingNotificationCta]: proactive,
      [styles.ongoingNotificationDesktop]: !proactive && !isMobile,
      [styles.ongoingNotificationMobile]: !proactive && isMobile
    });
    const containerClassName = classNames(
      { [styles.notificationContainerMobile]: !proactive && isMobile }
    );

    return (
      <ChatPopup
        isMobile={isMobile}
        showCta={proactive}
        isDismissible={true}
        onCloseIconClick={chatNotificationDismissed}
        className={className}
        containerClassName={containerClassName}
        show={notification.show && shouldShow}
        leftCtaLabel={i18n.t('embeddable_framework.chat.popup.button.dismiss')}
        leftCtaFn={chatNotificationDismissed}
        rightCtaLabel={i18n.t('embeddable_framework.chat.popup.button.reply')}
        rightCtaFn={chatNotificationRespond}
        childrenOnClick={chatNotificationRespond}>
        {this.renderProactiveContent()}
      </ChatPopup>
    );
  }
}
