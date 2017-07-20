import React, { Component } from 'react';
import PropTypes from 'prop-types';

import { MessageBubble } from 'component/chat/MessageBubble';

import { locals as styles } from './ChatMessage.sass';

const AgentBackgroundColor = '#f3f3f3';
const UserBackgroundColor = '#30AABC';

export class ChatMessage extends Component {
  static propTypes = {
    nick: PropTypes.string,
    name: PropTypes.string,
    message: PropTypes.string,
    userColor: PropTypes.string.isRequired
  };

  static defaultProps = {
    nick: '',
    name: '',
    message: ''
  };

  renderName = (isAgent) => {
    return isAgent
         ? <div className={styles.name}>{this.props.name}</div>
         : null;
  }

  render() {
    const isAgent = this.props.nick.indexOf('agent') > -1;
    const backgroundColor = isAgent ? AgentBackgroundColor : this.props.userColor;
    const userClasses = isAgent ? styles.messageAgent : styles.messageUser;
    const messageColor = isAgent ? '#000000' : '#FFFFFF';

    return (
      <div className={styles.wrapper}>
        <div className={`${styles.message} ${userClasses}`}>
          {this.renderName(isAgent)}
          <MessageBubble
            color={messageColor}
            message={this.props.message}
            backgroundColor={backgroundColor} />
        </div>
      </div>
    );
  }
}
