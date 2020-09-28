import React, { useState } from 'react'
import PropTypes from 'prop-types'
import { getClient } from 'src/apps/messenger/suncoClient'

import Composer from 'src/apps/messenger/features/sunco-components/Composer'

const Footer = ({ isComposerEnabled }) => {
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

Footer.propTypes = {
  isComposerEnabled: PropTypes.bool
}

export default Footer
