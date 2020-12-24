import React, { useRef, useState } from 'react'
import PropTypes from 'prop-types'
import { KEY_CODES } from '@zendeskgarden/react-selection'

import { Container, Textarea, SendIcon, Field, SendButton } from './styles'

const triggerOnEnter = callback => e => {
  if (e.keyCode === KEY_CODES.ENTER && !e.shiftKey) {
    e.preventDefault()
    callback(e)
  }
}

const Composer = React.forwardRef(
  (
    {
      disabled = false,
      placeholder = 'Type a message',
      inputAriaLabel = 'Type a message',
      value = '',
      sendButtonTooltip = 'Send message',
      sendButtonAriaLabel = 'Send message',
      minRows = 1,
      maxRows = 5,
      onSendMessage = _value => {},
      onChange = _event => {}
    },
    ref
  ) => {
    const localRef = useRef(null)
    const inputRef = ref || localRef
    const [composerValue, setComposerValue] = useState(value)

    const handleChange = event => {
      setComposerValue(event.target.value)
      onChange(event)
    }

    const handleSubmit = () => {
      onSendMessage(composerValue)
      setComposerValue('')
      // inputRef.current.focus()
    }

    return (
      <Container>
        <Field>
          <Textarea
            maxRows={maxRows}
            minRows={minRows}
            onKeyDown={triggerOnEnter(handleSubmit)}
            onChange={handleChange}
            value={composerValue}
            placeholder={placeholder}
            aria-label={inputAriaLabel}
            ref={inputRef}
            disabled={disabled}
          />
          {composerValue && !disabled && (
            <SendButton
              onClick={handleSubmit}
              aria-label={sendButtonAriaLabel}
              title={sendButtonTooltip}
            >
              <SendIcon />
            </SendButton>
          )}
        </Field>
      </Container>
    )
  }
)

const ComposerPropTypes = {
  disabled: PropTypes.bool,
  placeholder: PropTypes.string,
  inputAriaLabel: PropTypes.string,
  sendButtonAriaLabel: PropTypes.string,
  sendButtonTooltip: PropTypes.string,
  minRows: PropTypes.number,
  maxRows: PropTypes.number,
  value: PropTypes.string,
  onChange: PropTypes.func,
  onSendMessage: PropTypes.func
}
Composer.propTypes = ComposerPropTypes

export { ComposerPropTypes }
export default Composer
