import React, { Component } from 'react';
import PropTypes from 'prop-types';

import { i18n } from 'service/i18n';
import { locals as styles } from './ChatEventMessage.scss';

export class ChatEventMessage extends Component {
  static propTypes = {
    event: PropTypes.object.isRequired,
    children: PropTypes.object
  };

  renderEventMessage(event) {
    const isAgent = (nick) => nick.indexOf('agent:') > -1;
    const agent = event.display_name;
    const ratingValue = event.new_rating;

    switch (event.type) {
      case 'chat.memberjoin':
        return isAgent(event.nick)
          ? i18n.t('embeddable_framework.chat.chatLog.agentJoined', { agent })
          : i18n.t('embeddable_framework.chat.chatLog.chatStarted');

      case 'chat.memberleave':
        return isAgent(event.nick)
          ? i18n.t('embeddable_framework.chat.chatLog.agentLeft', { agent })
          : i18n.t('embeddable_framework.chat.chatLog.chatEnded');

      case 'chat.rating':
        const value = i18n.t(`embeddable_framework.chat.chatLog.rating.${ratingValue}`);

        return ratingValue
          ? i18n.t('embeddable_framework.chat.chatLog.rating.description', { value })
          : i18n.t('embeddable_framework.chat.chatLog.rating.removed');
      case 'chat.comment':
        return i18n.t('embeddable_framework.chat.chatlog.comment.submitted');
    }
  }

  render() {
    const { event } = this.props;

    return (
      <div key={event.timestamp} className={styles.eventMessage}>
        {this.renderEventMessage(event)}
        {this.props.children}
      </div>
    );
  }
}
