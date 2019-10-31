import React from 'react'
import PropTypes from 'prop-types'
import useTranslation from 'src/hooks/useTranslation'
import { Container, SuccessIcon, Heading, Message, LinkText } from './styles'
import { TEST_IDS } from 'src/constants/shared'

const SuccessNotification = ({ onClick, doneText, icon }) => {
  const headingLabel = useTranslation(
    'embeddable_framework.common.notify.message.thanks_for_reaching_out_v2'
  )
  const messageLabel = useTranslation('embeddable_framework.common.notify.message.get_back_v2')
  return (
    <Container>
      <SuccessIcon data-testid={TEST_IDS.SUCCESS_NOTIFICATION_ICON}>{icon}</SuccessIcon>
      <div>
        <Heading>{headingLabel}</Heading>
        <Message>{messageLabel}</Message>
      </div>
      <div>
        <LinkText link={true} onClick={onClick}>
          {doneText}
        </LinkText>
      </div>
    </Container>
  )
}

SuccessNotification.propTypes = {
  onClick: PropTypes.func,
  doneText: PropTypes.string,
  icon: PropTypes.object
}

export default SuccessNotification
