import React, { useEffect, useRef } from 'react'
import PropTypes from 'prop-types'
import { KEY_CODES } from '@zendeskgarden/react-selection'

import { Container, Textarea, SendIcon, Field, SendButton } from './styles'

const triggerOnEnter = callback => e => {
  if (e.keyCode === KEY_CODES.ENTER && !e.shiftKey) {
    e.preventDefault()
    callback(e)
  }
}

const Composer = ({ isEnabled, maxRows, minRows, label, onSubmit, onChange, message }) => {
  const inputRef = useRef(null)

  useEffect(() => {
    if (isEnabled) inputRef.current?.focus()
  }, [isEnabled])

  const handleSubmit = () => {
    onSubmit(message)
    inputRef.current.focus()
  }

  return (
    <Container>
      <Field>
        <Textarea
          maxRows={maxRows}
          minRows={minRows}
          onKeyDown={triggerOnEnter(handleSubmit)}
          onChange={onChange}
          value={message}
          placeholder={label}
          aria-label={label}
          ref={inputRef}
          disabled={!isEnabled}
        />
        {message && isEnabled && (
          <SendButton onClick={handleSubmit} aria-label="Send message">
            <SendIcon />
          </SendButton>
        )}
      </Field>
    </Container>
  )
}

Composer.propTypes = {
  isEnabled: PropTypes.bool,
  maxRows: PropTypes.number,
  minRows: PropTypes.number,
  onChange: PropTypes.func,
  message: PropTypes.string,
  onSubmit: PropTypes.func,
  label: PropTypes.string
}

export default Composer
