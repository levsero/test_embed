import React from 'react'

import { i18n } from 'service/i18n'

import TalkSuccessIcon from 'src/embeds/talk/icons/talk_success.svg'
import { locals as styles } from './styles.scss'

const SuccessNotificationMessage = () => {
  return (
    <div className={styles.container}>
      <TalkSuccessIcon className={styles.talkSuccessIcon} />
      <div>
        <h2 className={styles.primary}>
          {i18n.t('embeddable_framework.common.notify.message.thanks_for_reaching_out')}
        </h2>
        <p className={styles.secondary}>
          {i18n.t('embeddable_framework.common.notify.message.get_back')}
        </p>
      </div>
    </div>
  )
}

export default SuccessNotificationMessage
