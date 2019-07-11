import React from 'react'
import { SuccessNotification } from 'component/shared/SuccessNotification'
import { ICONS } from 'constants/shared'
import { isMobileBrowser } from 'utility/devices'

const SuccessNotificationPage = () => {
  const isMobile = isMobileBrowser()

  return <SuccessNotification icon={ICONS.SUCCESS_TALK} isMobile={isMobile} />
}

export default SuccessNotificationPage
