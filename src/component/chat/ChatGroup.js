import React, { Component } from 'react';
import PropTypes from 'prop-types';
import _ from 'lodash';

import { MessageBubble } from 'component/chat/MessageBubble';
import { Avatar } from 'component/Avatar';

import { locals as styles } from './ChatGroup.sass';

export class ChatGroup extends Component {
  static propTypes = {
    children: PropTypes.array,
    isAgent: PropTypes.bool.isRequired,
    avatarPath: PropTypes.string
  };

  static defaultProps = {
    children: [],
    avatarPath: ''
  };

  renderName = () => {
    const { isAgent } = this.props;
    const name = _.get(this.props.children, '0.display_name', '');

    return (isAgent && name !== '')
         ? <div className={styles.name}>{name}</div>
         : null;
  }

  renderAvatar = () => {
    const { isAgent, avatarPath } = this.props;
    const avatarStyles = avatarPath ? styles.avatar : styles.avatarDefault;

    if (!isAgent) return null;

    return (
      <Avatar className={avatarStyles} src={avatarPath} />
    );
  }

  renderChatMessage = (data = {}, index) => {
    const { isAgent } = this.props;
    const userClasses = isAgent ? styles.messageAgent : styles.messageUser;
    const userBackgroundStyle = isAgent ? styles.agentBackground : styles.userBackground;

    return (
      <div key={index} className={styles.wrapper}>
        <div className={`${styles.message} ${userClasses}`}>
          <MessageBubble
            className={`${styles.messageBubble} ${userBackgroundStyle}`}
            message={data.msg} />
        </div>
      </div>
    );
  }

  render() {
    return (
      <div className={styles.container}>
        {this.renderName()}
        {_.map(this.props.children, this.renderChatMessage)}
        {this.renderAvatar()}
      </div>
    );
  }
}
