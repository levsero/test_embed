import React from 'react'
import { useDispatch } from 'react-redux'
import { Close, Notification } from '@zendeskgarden/react-notifications'

import { snapcallCallFailedNotificationClosed } from 'embeds/talk/actions'

import { Title } from './styles'

const CallFailedNotification = () => {
  const dispatch = useDispatch()

  return (
    <Notification>
      <Title>Call failed</Title>

      <Close
        onClick={() => dispatch(snapcallCallFailedNotificationClosed())}
        aria-label="Dismiss Notification"
      />
    </Notification>
  )
}

export default CallFailedNotification
