import React, { Component } from 'react';
import PropTypes from 'prop-types';

import { MessageBubble } from './MessageBubble';
import { locals as styles } from './ChatReconnectionBubble.sass';

export class ChatReconnectionBubble extends Component {
  render = () => {
    return (
      <div className={styles.container}>
        <MessageBubble className={styles.bubble} message='Reconnecting' />
      </div>
    );
  }
}
