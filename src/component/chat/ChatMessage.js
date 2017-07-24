import React, { Component } from 'react';
import PropTypes from 'prop-types';
import _ from 'lodash';

import { MessageBubble } from 'component/chat/MessageBubble';
import { Avatar } from 'component/Avatar';

import { locals as styles } from './ChatMessage.sass';

const AgentBackgroundColor = '#f3f3f3';
const UserBackgroundColor = '#30AABC';

export class ChatMessage extends Component {
  static propTypes = {
    nick: PropTypes.string,
    name: PropTypes.string,
    message: PropTypes.string,
    userColor: PropTypes.string.isRequired,
    showAvatar: PropTypes.bool
  };

  static defaultProps = {
    nick: '',
    name: '',
    message: '',
    showAvatar: false
  };

  renderName = (isAgent) => {
    const { name } = this.props;

    return isAgent && !_.isEmpty(name)
         ? <div className={styles.name}>{name}</div>
         : null;
  }

  renderAvatar = () => {
    const { showAvatar, avatarPath } = this.props;

    if (!showAvatar) return null;

    return (
      <Avatar className={styles.avatar} src={avatarPath} />
    );
  }

  render() {
    const { nick, showAvatar, userColor, message } = this.props;
    const isAgent = nick.indexOf('agent') > -1;
    const backgroundColor = isAgent ? AgentBackgroundColor : userColor;
    const userClasses = isAgent ? styles.messageAgent : styles.messageUser;
    const messageColor = isAgent ? '#000000' : '#FFFFFF';
    const messageBubbleStyle = showAvatar ? styles.messageBubbleAvatar : styles.messageBubble;

    return (
      <div className={styles.wrapper}>
        <div className={`${styles.message} ${userClasses}`}>
          {this.renderName(isAgent)}
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
