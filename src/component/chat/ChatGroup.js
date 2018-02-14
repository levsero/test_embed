import React, { Component } from 'react';
import PropTypes from 'prop-types';
import _ from 'lodash';

import { Avatar } from 'component/Avatar';
import { MessageBubble } from 'component/chat/MessageBubble';

import { locals as styles } from './ChatGroup.scss';

export class ChatGroup extends Component {
  static propTypes = {
    messages: PropTypes.array,
    isAgent: PropTypes.bool.isRequired,
    avatarPath: PropTypes.string
  };

  static defaultProps = {
    messages: [],
    avatarPath: ''
  };

  renderName() {
    const { isAgent } = this.props;
    const name = _.get(this.props.messages, '0.display_name');

    if (!isAgent || !name) return null;

    return (
      <div className={styles.name}>{name}</div>
    );
  }

  renderAvatar() {
    const { isAgent, avatarPath } = this.props;
    const avatarStyles = avatarPath ? styles.avatarWithSrc : styles.avatarDefault;

    if (!isAgent) return null;

    return (
      <Avatar className={avatarStyles} src={avatarPath} />
    );
  }

  renderChatMessages() {
    const { isAgent, messages } = this.props;
    const userClasses = isAgent ? styles.messageAgent : styles.messageUser;
    const userBackgroundStyle = isAgent ? styles.agentBackground : styles.userBackground;

    return messages.map((chat) => {
      let messageContent;

      if (chat.msg) {
        messageContent = chat.msg;
      } else if (chat.file) {
        // temporary so we have a visual representation of attachments uploaded, will be replaced
        messageContent = chat.uploading ? 'uploading' : 'uploaded';
      }

      return (
        <div key={chat.timestamp} className={styles.wrapper}>
          <div className={`${styles.message} ${userClasses}`}>
            <MessageBubble
              className={`${styles.messageBubble} ${userBackgroundStyle}`}
              message={messageContent} />
          </div>
        </div>
      );
    });
  }

  render() {
    return (
      <div className={styles.container}>
        {this.renderName()}
        {this.renderChatMessages()}
        {this.renderAvatar()}
      </div>
    );
  }
}
