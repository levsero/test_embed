import React, { useState, useRef, useEffect } from 'react'
import { KEY_CODES } from '@zendeskgarden/react-selection'

import { Container, Textarea, SendIcon, Field, SendButton } from './styles'

const triggerOnEnter = callback => e => {
  if (e.keyCode === KEY_CODES.ENTER && !e.shiftKey) {
    e.preventDefault()
    callback(e)
  }
}

const Footer = () => {
  const [message, setMessage] = useState('')
  const inputRef = useRef(null)

  useEffect(() => {
    inputRef.current?.focus()
  }, [])

  const sendMessage = e => {
    setMessage('')
    /* eslint-disable no-console */
    console.log('User sent: ', e.target.value)
    /* eslint-enable no-console */
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
        />
      </Field>

      {message && (
        <SendButton onClick={e => sendMessage(e)} aria-label="Send message">
          <SendIcon />
        </SendButton>
      )}
    </Container>
  )
}

export default Footer
