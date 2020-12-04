import React from 'react'
import { Notification } from '@zendeskgarden/react-notifications'
import { Title } from 'src/components/Alert'
import useTranslate from 'src/hooks/useTranslate'

const ContactDetailsSuccess = () => {
  const translate = useTranslate()
  return (
    <Notification
      type="success"
      role="alert"
      tabIndex={0}
      ref={ref => {
        setTimeout(() => {
          ref?.focus()
        }, 0)
      }}
    >
      <Title>
        <strong>
          {translate('embeddable_framework.chat.options.editContactDetailsSubmission.success')}
        </strong>
      </Title>
    </Notification>
  )
}

export default ContactDetailsSuccess
