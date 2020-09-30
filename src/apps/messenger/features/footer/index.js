import React, { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { getIsComposerEnabled } from 'src/apps/messenger/features/footer/store'
import Composer from 'src/apps/messenger/features/sunco-components/Composer'
import { sendMessage } from 'src/apps/messenger/features/messageLog/store'
import { startTyping, stopTyping } from 'src/apps/messenger/features/footer/typing'

const Footer = () => {
  const isComposerEnabled = useSelector(getIsComposerEnabled)
  const dispatch = useDispatch()
  const [message, setMessage] = useState('')

  const onSubmit = () => {
    dispatch(sendMessage({ message }))
    stopTyping()
    setMessage('')
  }

  const onChange = e => {
    const { value } = e.target
    startTyping()
    setMessage(value)
  }

  return (
    <Composer
      isEnabled={isComposerEnabled}
      label="Type a message"
      maxRows={5}
      minRows={1}
      message={message}
      onSubmit={onSubmit}
      onChange={onChange}
    />
  )
}

export default Footer
