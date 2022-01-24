import PropTypes from 'prop-types'
import { Field } from '@zendeskgarden/react-forms'
import { TEST_IDS } from 'classicSrc/constants/shared'
import useOnMultilineSubmit from 'classicSrc/hooks/useOnMultilineSubmit'
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
  const {
    handleCompositionStart,
    handleCompositionEnd,
    handleKeyDown,
    handleKeyUp,
  } = useOnMultilineSubmit(handleSendInputValue)

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
          onCompositionStart={handleCompositionStart}
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
