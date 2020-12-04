import React from 'react'
import { useDispatch } from 'react-redux'
import PropTypes from 'prop-types'
import { Paragraph, Close, Notification } from '@zendeskgarden/react-notifications'

import useTranslate from 'src/hooks/useTranslate'
import { snapcallCallEndedNotificationClosed } from 'embeds/talk/actions'

import { Title } from './styles'

const CallEndedNotification = ({ callDuration }) => {
  const dispatch = useDispatch()
  const translate = useTranslate()

  return (
    <Notification>
      <Title>
        {translate('embeddable_framework.talk.clickToCall.callEndedNotification.title')}
      </Title>
      <Paragraph>
        {translate('embeddable_framework.talk.clickToCall.callEndedNotification.callDuration', {
          duration: callDuration
        })}
      </Paragraph>
      <Close
        onClick={() => dispatch(snapcallCallEndedNotificationClosed())}
        aria-label="Dismiss Notification"
      />
    </Notification>
  )
}

CallEndedNotification.propTypes = {
  callDuration: PropTypes.string.isRequired
}

export default CallEndedNotification
