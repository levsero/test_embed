import React from 'react'
import { i18n } from 'service/i18n'
import { Container, SuccessIcon, Heading, Message } from './styles'

const SuccessNotification = () => {
  return (
    <Container>
      <SuccessIcon />
      <div>
        <Heading>
          {i18n.t('embeddable_framework.common.notify.message.thanks_for_reaching_out')}
        </Heading>
        <Message>{i18n.t('embeddable_framework.common.notify.message.get_back')}</Message>
      </div>
    </Container>
  )
}

export default SuccessNotification
