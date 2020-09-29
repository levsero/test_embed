import React, { useState } from 'react'
import { useSelector } from 'react-redux'

import { getClient } from 'src/apps/messenger/suncoClient'
import { getIsComposerEnabled } from 'src/apps/messenger/features/footer/store'
import Composer from 'src/apps/messenger/features/sunco-components/Composer'

const Footer = () => {
  const isComposerEnabled = useSelector(getIsComposerEnabled)
  const [message, setMessage] = useState('')

  const sendMessage = () => {
    const client = getClient()
    client.sendMessage(message)
    setMessage('')
  }

  const onChange = e => {
    const { value } = e.target
    setMessage(value)
  }

  return (
    <Composer
      isEnabled={isComposerEnabled}
      label="Type a message"
      maxRows={5}
      minRows={1}
      message={message}
      onSubmit={sendMessage}
      onChange={onChange}
    />
  )
}

export default Footer
