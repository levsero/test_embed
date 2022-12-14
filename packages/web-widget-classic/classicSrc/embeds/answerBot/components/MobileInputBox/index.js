import { i18n } from 'classicSrc/app/webWidget/services/i18n'
import { Icon } from 'classicSrc/component/Icon'
import { ICONS } from 'classicSrc/constants/shared'
import InputBox from 'classicSrc/embeds/answerBot/components/InputBox'
import PropTypes from 'prop-types'
import { useState } from 'react'
import { Container, InputBoxContainer, FooterIconButton } from './styles'

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
  questionValueChanged,
  handleSendInputValue,
  name,
}) => {
  const [isComposerFocused, setIsComposerFocused] = useState(false)

  return (
    <Container isFocused={isComposerFocused}>
      <InputBoxContainer>
        <InputBox
          inputValue={inputValue}
          name={name}
          placeholder={placeholder}
          questionValueChanged={questionValueChanged}
          handleSendInputValue={handleSendInputValue}
          isMobile={true}
          onFocus={() => {
            setIsComposerFocused(true)
          }}
          onBlur={() => {
            setIsComposerFocused(false)
          }}
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
  questionValueChanged: PropTypes.func.isRequired,
  handleSendInputValue: PropTypes.func.isRequired,
}

export default MobileInputBox
