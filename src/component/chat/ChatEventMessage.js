import React, { Component } from 'react';
import PropTypes from 'prop-types';
import _ from 'lodash';

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
        return event.nick === 'visitor' ?
          i18n.t('embeddable_framework.chat.chatLog.chatStarted',
            { fallback: 'Chat started' }) :
          i18n.t('embeddable_framework.chat.chatLog.agentJoined',
            { agent, fallback: `${agent} joined the chat`});

      case 'chat.memberleave':
        return event.nick === 'visitor' ?
          i18n.t('embeddable_framework.chat.chatLog.chatEnded',
            { fallback: 'Chat ended' }) :
          i18n.t('embeddable_framework.chat.chatLog.agentLeft',
            { agent, fallback: `${agent} left the chat`});

      case 'chat.rating':
        const value = i18n.t(`embeddable_framework.chat.chatLog.rating.${ratingValue}`,
          { fallback: _.upperFirst(event.new_rating) });

        return ratingValue ?
          i18n.t('embeddable_framework.chat.chatLog.rating.description',
            { value, fallback: `Chat rated ${value}` }) :
          i18n.t('embeddable_framework.chat.chatLog.rating.removed',
            { fallback: 'Chat rating removed' });
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
