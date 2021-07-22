import PropTypes from 'prop-types'
import { Field } from '@zendeskgarden/react-forms'
import { TEST_IDS } from 'src/constants/shared'
import { keyCodes } from 'utility/keyboard'
import { Container, HiddenLabel, Input } from './styles'

const InputBox = ({
  inputValue,
  name,
  placeholder,
  handleSendInputValue,
  updateInputValue,
  isMobile,
}) => {
  const handleKeyDown = (e) => {
    if (e.keyCode === keyCodes.ENTER && !e.shiftKey) {
      e.preventDefault()
      handleSendInputValue()
    }
  }

  const handleInputValueChanged = (e) => {
    const { value } = e.target
    updateInputValue(value)
  }

  return (
    <Container>
      <Field>
        <HiddenLabel>{placeholder}</HiddenLabel>
        <Input
          value={inputValue}
          onChange={handleInputValueChanged}
          onKeyDown={handleKeyDown}
          placeholder={placeholder}
          name={name}
          rows={isMobile ? 1 : 3}
          data-testid={TEST_IDS.MESSAGE_FIELD}
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
  updateInputValue: PropTypes.func,
  isMobile: PropTypes.bool,
}

export default InputBox
