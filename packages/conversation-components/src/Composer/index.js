import PropTypes from 'prop-types'
import { forwardRef, useState } from 'react'
import { KEY_CODES } from '@zendeskgarden/react-selection'
import useLabels from 'src/hooks/useLabels'
import { Container, Textarea, SendIcon, Field, SendButton } from './styles'

const triggerOnEnter = (callback) => (e) => {
  if (e.keyCode === KEY_CODES.ENTER && !e.shiftKey) {
    e.preventDefault()
    callback(e)
  }
}

const Composer = forwardRef(
  (
    {
      disabled = false,
      minRows = 1,
      maxRows = 5,
      initialValue = '',
      onChange = (_event) => {},
      onSendMessage = (_value) => {},
    },
    ref
  ) => {
    const [composerValue, setComposerValue] = useState(initialValue)
    const labels = useLabels().composer
    const handleChange = (event) => {
      setComposerValue(event.target.value)
      onChange(event)
    }

    const handleSubmit = () => {
      onSendMessage(composerValue)
      setComposerValue('')
    }

    return (
      <Container>
        <Field>
          <Textarea
            ref={ref}
            disabled={disabled}
            placeholder={labels.placeholder}
            aria-label={labels.inputAriaLabel}
            minRows={minRows}
            maxRows={maxRows}
            value={composerValue}
            onKeyDown={triggerOnEnter(handleSubmit)}
            onChange={handleChange}
          />
          {composerValue && !disabled && (
            <SendButton
              title={labels.sendButtonTooltip}
              aria-label={labels.sendButtonAriaLabel}
              onClick={handleSubmit}
            >
              <SendIcon />
            </SendButton>
          )}
        </Field>
      </Container>
    )
  }
)

Composer.propTypes = {
  disabled: PropTypes.bool,
  minRows: PropTypes.number,
  maxRows: PropTypes.number,
  initialValue: PropTypes.string,
  onChange: PropTypes.func,
  onSendMessage: PropTypes.func,
}
export default Composer
