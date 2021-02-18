import React from 'react'
import PropTypes from 'prop-types'
import useTranslate from 'src/hooks/useTranslate'
import { Container, SuccessIcon, Heading, Message, LinkText } from './styles'
import { TEST_IDS } from 'src/constants/shared'

const SuccessNotification = ({ onClick, doneText, icon }) => {
  const translate = useTranslate()

  return (
    <Container>
      <SuccessIcon data-testid={TEST_IDS.SUCCESS_NOTIFICATION_ICON}>{icon}</SuccessIcon>
      <div>
        <Heading>
          {translate('embeddable_framework.common.notify.message.thanks_for_reaching_out_v2')}
        </Heading>
        <Message>{translate('embeddable_framework.common.notify.message.get_back_v2')}</Message>
      </div>
      <div>
        <LinkText isLink={true} onClick={onClick}>
          {doneText}
        </LinkText>
      </div>
    </Container>
  )
}

SuccessNotification.propTypes = {
  onClick: PropTypes.func,
  doneText: PropTypes.string,
  icon: PropTypes.object,
}

export default SuccessNotification
