import React, { useEffect, useRef, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import {
  getComposerDraft,
  getIsComposerEnabled,
  saveDraft
} from 'src/apps/messenger/features/footer/store'
import Composer from 'src/apps/messenger/features/sunco-components/Composer'
import { sendMessage } from 'src/apps/messenger/features/messageLog/store'
import { cancelTyping, startTyping } from 'src/apps/messenger/features/footer/typing'

const Footer = () => {
  const dispatch = useDispatch()
  const isComposerEnabled = useSelector(getIsComposerEnabled)
  const composerDraft = useSelector(getComposerDraft)
  const [message, setMessage] = useState(composerDraft)
  const lastMessage = useRef(message)
  lastMessage.current = message

  const onSubmit = () => {
    dispatch(sendMessage({ message }))
    cancelTyping()
    setMessage('')
  }

  const onChange = e => {
    const { value } = e.target
    startTyping()
    setMessage(value)
  }

  useEffect(() => {
    return () => {
      dispatch(saveDraft({ message: lastMessage.current }))
    }
  }, [])

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
