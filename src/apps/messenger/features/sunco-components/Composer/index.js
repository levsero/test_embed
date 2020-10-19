import React, { useEffect, useRef } from 'react'
import PropTypes from 'prop-types'
import { KEY_CODES } from '@zendeskgarden/react-selection'

import { Container, Textarea, SendIcon, Field, SendButton } from './styles'
import { getIsFullScreen } from 'src/apps/messenger/features/responsiveDesign/store'
import { useSelector } from 'react-redux'

const triggerOnEnter = callback => e => {
  if (e.keyCode === KEY_CODES.ENTER && !e.shiftKey) {
    e.preventDefault()
    callback(e)
  }
}

const Composer = ({ isEnabled, maxRows, minRows, label, onSubmit, onChange, message }) => {
  const inputRef = useRef(null)
  const previouslyEnabled = useRef(false)
  const isFullScreen = useSelector(getIsFullScreen)

  useEffect(() => {
    if (isFullScreen) {
      return
    }

    if (isEnabled && !previouslyEnabled.current) {
      inputRef.current?.focus()
      previouslyEnabled.current = true
    }

    if (previouslyEnabled.current && !isEnabled) {
      previouslyEnabled.current = false
    }
  }, [isEnabled, isFullScreen])

  const handleSubmit = () => {
    if (message.trim() === 0) {
      return
    }

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
