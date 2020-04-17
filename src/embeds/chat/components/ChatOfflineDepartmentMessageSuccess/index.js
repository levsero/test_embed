import React from 'react'
import PropTypes from 'prop-types'

import useTranslate from 'src/hooks/useTranslate'

import { BackButton, Info, Message, OfflineMessage, SuccessContainer } from './styles'

const ChatOfflineDepartmentMessageSuccess = ({
  offlineMessage: {
    details: { name, email, phone, message }
  },
  onFormBack = () => {}
}) => {
  const translate = useTranslate()

  return (
    <SuccessContainer>
      <Message>{translate('embeddable_framework.chat.preChat.offline.label.confirmation')}</Message>
      <Info>
        <b>{name}</b>
        <p>{email}</p>
        <p>{phone}</p>
        <OfflineMessage>{message}</OfflineMessage>
      </Info>
      <BackButton primary={true} onClick={onFormBack}>
        {translate('embeddable_framework.chat.preChat.offline.button.sendAnother')}
      </BackButton>
    </SuccessContainer>
  )
}

ChatOfflineDepartmentMessageSuccess.propTypes = {
  offlineMessage: PropTypes.shape({
    details: PropTypes.shape({
      name: PropTypes.string,
      email: PropTypes.string,
      phone: PropTypes.string,
      message: PropTypes.string
    })
  }),
  onFormBack: PropTypes.func
}

export default ChatOfflineDepartmentMessageSuccess
