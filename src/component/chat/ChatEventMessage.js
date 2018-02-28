import React, { Component } from 'react';
import PropTypes from 'prop-types';

import { i18n } from 'service/i18n';
import { locals as styles } from './ChatEventMessage.scss';

export class ChatEventMessage extends Component {
  static propTypes = {
    event: PropTypes.object.isRequired
  };

  renderEventMessage(event) {
    const agent = event.display_name;
    const ratingValue = event.new_rating;

    switch (event.type) {
      case 'chat.memberjoin':
        return event.nick === 'visitor'
          ? i18n.t('embeddable_framework.chat.chatLog.chatStarted')
          : i18n.t('embeddable_framework.chat.chatLog.agentJoined', { agent });

      case 'chat.memberleave':
        return event.nick === 'visitor'
          ? i18n.t('embeddable_framework.chat.chatLog.chatEnded')
          : i18n.t('embeddable_framework.chat.chatLog.agentLeft', { agent });

      case 'chat.rating':
        const value = i18n.t(`embeddable_framework.chat.chatLog.rating.${ratingValue}`);

        return ratingValue
          ? i18n.t('embeddable_framework.chat.chatLog.rating.description', { value })
          : i18n.t('embeddable_framework.chat.chatLog.rating.removed');
    }
  }

  render() {
    const { event } = this.props;

    return (
      <div key={event.timestamp} className={styles.eventMessage}>
        {this.renderEventMessage(event)}
      </div>
    );
  }
}
