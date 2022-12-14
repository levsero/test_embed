import PropTypes from 'prop-types'
import { Field } from '@zendeskgarden/react-forms'
import { TEST_IDS } from 'classicSrc/constants/shared'
import useOnMultilineSubmit from 'classicSrc/hooks/useOnMultilineSubmit'
import useTranslate from 'classicSrc/hooks/useTranslate'
import { Container, HiddenLabel, StyledTextarea } from './styles'

const InputBox = ({
  currentMessage = '',
  sendChat,
  handleChatBoxChange,
  isMobile,
  onFocus,
  onBlur,
}) => {
  const translate = useTranslate()
  const {
    handleCompositionStart,
    handleCompositionEnd,
    handleKeyDown,
    handleKeyUp,
  } = useOnMultilineSubmit(sendChat)

  const handleChange = (e) => {
    const { value } = e.target
    handleChatBoxChange(value)
  }

  const placeholder = translate('embeddable_framework.chat.chatBox.placeholder.typeMessageHere_v2')

  return (
    <Container>
      <Field>
        <HiddenLabel>{placeholder}</HiddenLabel>
        <StyledTextarea
          value={currentMessage}
          onChange={handleChange}
          onKeyDown={handleKeyDown}
          onKeyUp={handleKeyUp}
          onCompositionStart={handleCompositionStart}
          onCompositionEnd={handleCompositionEnd}
          placeholder={placeholder}
          name="chatBox"
          rows={isMobile ? 1 : 3}
          data-testid={TEST_IDS.MESSAGE_FIELD}
          onFocus={onFocus}
          onBlur={onBlur}
        />
      </Field>
    </Container>
  )
}

InputBox.propTypes = {
  isMobile: PropTypes.bool.isRequired,
  currentMessage: PropTypes.string,
  sendChat: PropTypes.func.isRequired,
  handleChatBoxChange: PropTypes.func.isRequired,
  onFocus: PropTypes.func,
  onBlur: PropTypes.func,
}

export default InputBox
