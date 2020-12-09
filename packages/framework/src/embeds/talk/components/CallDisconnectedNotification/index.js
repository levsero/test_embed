import React from 'react'
import { useDispatch } from 'react-redux'
import PropTypes from 'prop-types'
import { Paragraph, Close, Notification } from '@zendeskgarden/react-notifications'

import useTranslate from 'src/hooks/useTranslate'
import { snapcallCallDisconnectedNotificationClosed } from 'embeds/talk/actions'

import { Title } from './styles'

const CallDisconnectedNotification = ({ callDuration }) => {
  const dispatch = useDispatch()
  const translate = useTranslate()

  return (
    <Notification>
      <Title>
        {translate('embeddable_framework.talk.clickToCall.callDisconnectedNotification.title')}
      </Title>
      <Paragraph>
        {translate(
          'embeddable_framework.talk.clickToCall.callDisconnectedNotification.callDuration',
          {
            duration: callDuration
          }
        )}
      </Paragraph>
      <Close
        onClick={() => dispatch(snapcallCallDisconnectedNotificationClosed())}
        aria-label="Dismiss Notification"
      />
    </Notification>
  )
}

CallDisconnectedNotification.propTypes = {
  callDuration: PropTypes.string.isRequired
}

export default CallDisconnectedNotification
