import React, { Component } from 'react';
import PropTypes from 'prop-types';

import { MessageBubble } from 'component/chat/MessageBubble';
import { Avatar } from 'component/Avatar';

import { locals as styles } from './ChatMessage.sass';

export class ChatMessage extends Component {
  static propTypes = {
    isAgent: PropTypes.bool.isRequired,
    name: PropTypes.string,
    message: PropTypes.string,
    showAvatar: PropTypes.bool,
    avatarPath: PropTypes.string
  };

  static defaultProps = {
    name: '',
    message: '',
    showAvatar: false,
    avatarPath: ''
  };

  renderName = () => {
    const { name } = this.props;

    return (name !== '')
         ? <div className={styles.name}>{name}</div>
         : null;
  }

  renderAvatar = () => {
    const { showAvatar, avatarPath } = this.props;
    const avatarStyles = avatarPath ? styles.avatar : styles.avatarDefault;

    if (!showAvatar) return null;

    return (
      <Avatar className={avatarStyles} src={avatarPath} />
    );
  }

  renderMessageBubble = () => {
    const { showAvatar, message, isAgent } = this.props;
    const userBackgroundStyle = isAgent ? styles.agentBackground : styles.userBackground;
    const messageBubbleStyle = showAvatar ? styles.messageBubbleAvatar : styles.messageBubble;

    return (
      <MessageBubble
        className={`${messageBubbleStyle} ${userBackgroundStyle}`}
        message={message} />
    );
  }

  render() {
    const userClasses = this.props.isAgent ? styles.messageAgent : styles.messageUser;

    return (
      <div className={styles.wrapper}>
        <div className={`${styles.message} ${userClasses}`}>
          {this.renderName()}
          {this.renderAvatar()}
          {this.renderMessageBubble()}
        </div>
      </div>
    );
  }
}
