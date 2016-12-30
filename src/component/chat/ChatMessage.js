import React, { Component, PropTypes } from 'react';

import { MessageBubble } from 'src/component/chat/MessageBubble';

import { locals as styles } from './ChatMessage.sass';

export class ChatMessage extends Component {
  render() {
    const isAgent = this.props.nick.indexOf('agent') > -1;
    const color = isAgent ? '#6AABC4' : '#30AABC';
    const userClasses = !isAgent ? styles.messageUser : styles.messageAgent;

    return (
      <div className={styles.wrapper}>
        <div className={`${styles.message} ${userClasses}`}>
          <div className={styles.name}>{this.props.name}</div>
          <MessageBubble message={this.props.message} backgroundColor={color} />
        </div>
      </div>
    );
  }
}
