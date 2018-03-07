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
    avatarPath: PropTypes.string,
    showAvatar: PropTypes.bool.isRequired
  };

  static defaultProps = {
    messages: [],
    avatarPath: ''
  };

  renderName() {
    const { isAgent, showAvatar } = this.props;
    const name = _.get(this.props.messages, '0.display_name');
    const nameStyles = (showAvatar) ? styles.nameAvatar : styles.nameNoAvatar;

    if (!isAgent || !name) return null;

    return (
      <div className={nameStyles}>{name}</div>
    );
  }

  renderAvatar() {
    const { isAgent, avatarPath, showAvatar } = this.props;
    const avatarStyles = avatarPath ? styles.avatarWithSrc : styles.avatarDefault;

    if (!showAvatar || !isAgent) return null;

    return (
      <Avatar className={avatarStyles} src={avatarPath} />
    );
  }

  renderChatMessages() {
    const { isAgent, messages, showAvatar } = this.props;
    const userClasses = isAgent ? styles.messageAgent : styles.messageUser;
    const userBackgroundStyle = isAgent ? styles.agentBackground : styles.userBackground;
    const messageStyle = (showAvatar) ? styles.messageBubble : '';

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
              className={`${messageStyle} ${userBackgroundStyle}`}
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
