import React, { Component } from 'react';
import PropTypes from 'prop-types';

import { i18n } from 'service/i18n';
import { locals as styles } from './EventMessage.scss';
import classNames from 'classnames';

export class EventMessage extends Component {
  static propTypes = {
    event: PropTypes.object.isRequired,
    children: PropTypes.object,
    divider: PropTypes.node,
    chatLogCreatedAt: PropTypes.number
  };

  static defaultProps = {
    divider: null,
    chatLogCreatedAt: 0
  };

  renderEventMessage(event) {
    const isAgent = (nick) => nick.indexOf('agent:') > -1;

    switch (event.type) {
      case 'chat.memberjoin':
        return isAgent(event.nick)
          ? i18n.t('embeddable_framework.chat.chatLog.agentJoined', { agent: event.display_name })
          : i18n.t('embeddable_framework.chat.chatLog.chatStarted');

      case 'chat.memberleave':
        return isAgent(event.nick)
          ? i18n.t('embeddable_framework.chat.chatLog.agentLeft', { agent: event.display_name } )
          : i18n.t('embeddable_framework.chat.chatLog.chatEnded');

      case 'chat.rating':
        const ratingValue = event.new_rating;
        const value = i18n.t(`embeddable_framework.chat.chatLog.rating.${ratingValue}`);

        return ratingValue
          ? i18n.t('embeddable_framework.chat.chatLog.rating.description', { value })
          : i18n.t('embeddable_framework.chat.chatLog.rating.removed');
      case 'chat.comment':
        return i18n.t('embeddable_framework.chat.chatlog.comment.submitted');

      case 'chat.contact_details.updated':
        return i18n.t('embeddable_framework.chat.contact_details.updated');
    }
  }

  render() {
    const { event, chatLogCreatedAt } = this.props;
    const shouldAnimate = event.timestamp > chatLogCreatedAt;
    const wrapperClasses = classNames(
      styles.eventMessage,
      {
        [styles.fadeIn]: shouldAnimate
      }
    );

    return (
      <div key={event.timestamp} className={wrapperClasses}>
        {this.props.divider}
        {this.renderEventMessage(event)}
        {this.props.children}
      </div>
    );
  }
}
