import React, { useState, useRef, useEffect } from 'react'
import PropTypes from 'prop-types'
import { KEY_CODES } from '@zendeskgarden/react-selection'
import { getClient } from 'src/apps/messenger/suncoClient'

import { Container, Textarea, SendIcon, Field, SendButton } from './styles'

const triggerOnEnter = callback => e => {
  if (e.keyCode === KEY_CODES.ENTER && !e.shiftKey) {
    e.preventDefault()
    callback(e)
  }
}

const Footer = ({ isComposerEnabled }) => {
  const [message, setMessage] = useState('')
  const inputRef = useRef(null)

  useEffect(() => {
    if (isComposerEnabled) inputRef.current?.focus()
  }, [isComposerEnabled])

  const sendMessage = () => {
    const client = getClient()
    client.sendMessage(message)
    setMessage('')
    inputRef.current.focus()
  }

  const handleChange = e => {
    const { value } = e.target
    setMessage(value)
  }

  return (
    <Container>
      <Field>
        <Textarea
          maxRows={5}
          minRows={1}
          onKeyDown={triggerOnEnter(sendMessage)}
          onChange={handleChange}
          value={message}
          placeholder="Type a message"
          aria-label="Type a message"
          ref={inputRef}
          disabled={!isComposerEnabled}
        />
        {message && (
          <SendButton
            onClick={e => sendMessage(e)}
            aria-label="Send message"
            disabled={!isComposerEnabled}
          >
            <SendIcon />
          </SendButton>
        )}
      </Field>
    </Container>
  )
}

Footer.propTypes = {
  isComposerEnabled: PropTypes.bool
}

export default Footer
