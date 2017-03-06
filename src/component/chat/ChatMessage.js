import React, { Component, PropTypes } from 'react';

import { MessageBubble } from 'component/chat/MessageBubble';

import { locals as styles } from './ChatMessage.sass';

const AgentColor = '#6AABC4';
const UserColor = '#30AABC';

export class ChatMessage extends Component {
  static propTypes = {
    nick: PropTypes.string,
    name: PropTypes.string,
    message: PropTypes.string
  };

  static defaultProps = {
    nick: '',
    name: '',
    message: ''
  };

  render() {
    const isAgent = this.props.nick.indexOf('agent') > -1;
    const color = isAgent ? AgentColor : UserColor;
    const userClasses = isAgent ? styles.messageAgent : styles.messageUser;

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
