import React, { Component } from 'react';
import PropTypes from 'prop-types';
import _ from 'lodash';

import { MessageBubble } from 'component/chat/MessageBubble';
import { Avatar } from 'component/Avatar';

import { locals as styles } from './ChatMessage.sass';

const AgentBackgroundColor = '#f3f3f3';

export class ChatMessage extends Component {
  static propTypes = {
    isAgent: PropTypes.bool.isRequired,
    name: PropTypes.string,
    message: PropTypes.string,
    userColor: PropTypes.string.isRequired,
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
    const { name, isAgent } = this.props;

    return isAgent && !_.isEmpty(name)
         ? <div className={styles.name}>{name}</div>
         : null;
  }

  renderAvatar = () => {
    const { showAvatar, avatarPath } = this.props;
    const avatarStyles = avatarPath
                       ? styles.avatar
                       : styles.avatarDefault;

    return showAvatar
         ? <Avatar className={avatarStyles} src={avatarPath} />
         : null;
  }

  render() {
    const { showAvatar, userColor, message, isAgent } = this.props;
    const backgroundColor = isAgent ? AgentBackgroundColor : userColor;
    const userClasses = isAgent ? styles.messageAgent : styles.messageUser;
    const messageColor = isAgent ? '#000000' : '#FFFFFF';
    const messageBubbleStyle = showAvatar ? styles.messageBubbleAvatar : styles.messageBubble;

    return (
      <div className={styles.wrapper}>
        <div className={`${styles.message} ${userClasses}`}>
          {this.renderName()}
          {this.renderAvatar()}
          <MessageBubble
            className={messageBubbleStyle}
            color={messageColor}
            message={message}
            backgroundColor={backgroundColor} />
        </div>
      </div>
    );
  }
}
