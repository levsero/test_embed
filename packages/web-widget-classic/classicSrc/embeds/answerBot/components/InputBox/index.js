import { TEST_IDS } from 'classicSrc/constants/shared'
import { keyCodes } from 'classicSrc/util/keyboard'
import PropTypes from 'prop-types'
import { useState } from 'react'
import { Field } from '@zendeskgarden/react-forms'
import { Container, HiddenLabel, Input } from './styles'

const InputBox = ({
  inputValue,
  name,
  placeholder,
  handleSendInputValue,
  questionValueChanged,
  isMobile,
  onFocus,
  onBlur,
}) => {
  // event.nativeEvent.isComposing and isComposing flag are used
  // to support composing text in foreign languages across browsers.
  const [isComposing, setIsComposing] = useState(false)
  const handleKeyUp = () => setIsComposing(false)
  const handleCompositionEnd = () => setIsComposing(true)

  const handleKeyDown = (e) => {
    if (e.key === keyCodes.ENTER && !e.shiftKey && !e.nativeEvent.isComposing && !isComposing) {
      e.preventDefault()
      handleSendInputValue()
    }
  }

  const handleInputValueChanged = (e) => {
    const { value } = e.target

    questionValueChanged(value)
  }

  return (
    <Container>
      <Field>
        <HiddenLabel>{placeholder}</HiddenLabel>
        <Input
          value={inputValue}
          onChange={handleInputValueChanged}
          onKeyDown={handleKeyDown}
          onKeyUp={handleKeyUp}
          onCompositionEnd={handleCompositionEnd}
          placeholder={placeholder}
          name={name}
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
  inputValue: PropTypes.string,
  name: PropTypes.string.isRequired,
  placeholder: PropTypes.string.isRequired,
  handleSendInputValue: PropTypes.func.isRequired,
  questionValueChanged: PropTypes.func,
  isMobile: PropTypes.bool,
  onFocus: PropTypes.func,
  onBlur: PropTypes.func,
}

export default InputBox
