import React from 'react'
import PropTypes from 'prop-types'
import useTranslation from 'src/hooks/useTranslation'
import { Container, SuccessIcon, Heading, Message, LinkText } from './styles'

const SuccessNotification = ({ onClick, doneText, icon }) => {
  const headingLabel = useTranslation(
    'embeddable_framework.common.notify.message.thanks_for_reaching_out_v2'
  )
  const messageLabel = useTranslation('embeddable_framework.common.notify.message.get_back_v2')
  return (
    <Container>
      <SuccessIcon>{icon}</SuccessIcon>
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
