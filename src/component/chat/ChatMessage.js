import React, { Component, PropTypes } from 'react';

import { MessageBubble } from 'src/component/chat/MessageBubble';

import { locals as styles } from './ChatRow.sass';

export class ChatRow extends Component {
  render() {
    return (
      <div className={styles.message}>
        <div className={styles.name}>{this.props.name}</div>
      </div>
    );
  }
}
