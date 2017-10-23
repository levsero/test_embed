import React, { Component } from 'react';

import { LoadingSpinner } from 'component/loading/LoadingSpinner';
import { i18n } from 'service/i18n';

import { locals as styles } from './ChatReconnectionBubble.sass';

export class ChatReconnectionBubble extends Component {
  render = () => {
    const message = i18n.t(
      'embeddable_framework.chat.reconnecting.title',
      { fallback: 'Reconnecting' }
    );

    return (
      <div className={styles.container}>
        <div className={styles.bubble}>
          <div className={styles.contentContainer}>
            <div className={styles.title}>{message}</div>
            <LoadingSpinner className={styles.loadingSpinner} circleClasses={styles.circle} />
          </div>
        </div>
      </div>
    );
  }
}
