import React, { Component } from 'react'

import { LoadingSpinner } from 'component/loading/LoadingSpinner'
import { i18n } from 'service/i18n'

import { locals as styles } from './ChatReconnectionBubble.scss'

export class ChatReconnectionBubble extends Component {
  render = () => {
    const title = i18n.t('embeddable_framework.chat.reconnecting')

    return (
      <div className={styles.container}>
        <div className={styles.bubble}>
          <div className={styles.contentContainer}>
            <div className={styles.title} role="status" aria-live="polite">
              {title}
            </div>
            <LoadingSpinner className={styles.loadingSpinner} circleClasses={styles.circle} />
          </div>
        </div>
      </div>
    )
  }
}
