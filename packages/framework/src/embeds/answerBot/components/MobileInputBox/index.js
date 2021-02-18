import React from 'react'
import PropTypes from 'prop-types'

import { i18n } from 'src/apps/webWidget/services/i18n'
import InputBox from 'src/embeds/answerBot/components/InputBox'
import { Container, InputBoxContainer, FooterIconButton } from './styles'

import { Icon } from 'component/Icon'
import { ICONS } from 'constants/shared'

const renderSend = (handleSendInputValue) => {
  return (
    <FooterIconButton
      size="large"
      aria-label={i18n.t('embeddable_framework.submitTicket.form.submitButton.label.send')}
      onClick={handleSendInputValue}
    >
      <Icon type={ICONS.SEND_CHAT} />
    </FooterIconButton>
  )
}

const MobileInputBox = ({
  inputValue,
  placeholder,
  updateInputValue,
  handleSendInputValue,
  name,
}) => {
  return (
    <Container>
      <InputBoxContainer>
        <InputBox
          inputValue={inputValue}
          name={name}
          placeholder={placeholder}
          updateInputValue={updateInputValue}
          handleSendInputValue={handleSendInputValue}
          isMobile={true}
        />
      </InputBoxContainer>
      {renderSend(handleSendInputValue)}
    </Container>
  )
}

MobileInputBox.propTypes = {
  name: PropTypes.string.isRequired,
  inputValue: PropTypes.string.isRequired,
  placeholder: PropTypes.string.isRequired,
  updateInputValue: PropTypes.func.isRequired,
  handleSendInputValue: PropTypes.func.isRequired,
}

export default MobileInputBox
