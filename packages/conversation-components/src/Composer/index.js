import React, { useState } from 'react'
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
      sendButtonTooltip = 'Send message',
      sendButtonAriaLabel = 'Send message',
      minRows = 1,
      maxRows = 5,
      value = '',
      onChange = _event => {},
      onSendMessage = _value => {}
    },
    ref
  ) => {
    const [composerValue, setComposerValue] = useState(value)

    const handleChange = event => {
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
            placeholder={placeholder}
            aria-label={inputAriaLabel}
            minRows={minRows}
            maxRows={maxRows}
            value={composerValue}
            onKeyDown={triggerOnEnter(handleSubmit)}
            onChange={handleChange}
          />
          {composerValue && !disabled && (
            <SendButton
              title={sendButtonTooltip}
              aria-label={sendButtonAriaLabel}
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
export default Composer
