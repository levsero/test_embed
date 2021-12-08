import { TEST_IDS } from 'classicSrc/constants/shared'
import useTranslate from 'classicSrc/hooks/useTranslate'
import { keyCodes } from 'classicSrc/util/keyboard'
import PropTypes from 'prop-types'
import { useState } from 'react'
import { Field } from '@zendeskgarden/react-forms'
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

  // event.nativeEvent.isComposing and isComposing flag are used
  // to support composing text in foreign languages across browsers.
  const [isComposing, setIsComposing] = useState(false)
  const handleKeyUp = () => setIsComposing(false)
  const handleCompositionEnd = () => setIsComposing(true)

  const handleKeyDown = (e) => {
    if (e.key === keyCodes.ENTER && !e.shiftKey && !e.nativeEvent.isComposing && !isComposing) {
      e.preventDefault()
      sendChat()
    }
  }

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
