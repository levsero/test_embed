import React from 'react'

import { locals as styles } from './style.scss'
import { LoadingEllipses } from 'component/loading/LoadingEllipses'
import { TEST_IDS } from 'constants/shared'

const BotTyping = () => (
  <div className={styles.bubble} data-testid={TEST_IDS.AB_TYPING_INDICATOR}>
    <LoadingEllipses
      className={styles.loadingContainer}
      useUserColor={false}
      itemClassName={styles.loadingAnimation}
    />
  </div>
)

export default BotTyping
