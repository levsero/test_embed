import React from 'react'

import { locals as styles } from './style.scss'
import { LoadingEllipses } from 'component/loading/LoadingEllipses'

const BotTyping = () => (
  <div className={styles.bubble}>
    <LoadingEllipses
      className={styles.loadingContainer}
      useUserColor={false}
      itemClassName={styles.loadingAnimation}
    />
  </div>
)

export default BotTyping
