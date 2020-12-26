import React, { useEffect, useRef, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { MessengerFooter } from '@zendesk/conversation-components'
import {
  getComposerDraft,
  getIsComposerEnabled,
  saveDraft
} from 'src/apps/messenger/features/footer/store'
import { sendMessage } from 'src/apps/messenger/features/messageLog/store'
import { getIsFullScreen } from 'src/apps/messenger/features/responsiveDesign/store'
import { stopTyping, startTyping } from 'src/apps/messenger/features/footer/typing'

const Footer = () => {
  const dispatch = useDispatch()
  const composerRef = useRef(null)
  const isComposerEnabled = useSelector(getIsComposerEnabled)
  const isFullScreen = useSelector(getIsFullScreen)
  const composerDraft = useSelector(getComposerDraft)
  const [initialValue, setInitialValue] = useState(composerDraft)

  const onSendMessage = message => {
    if (message.trim().length === 0) {
      return
    }
    dispatch(sendMessage({ message }))
    stopTyping()
    setInitialValue('')
  }

  const onChange = _e => {
    startTyping()
  }

  useEffect(() => {
    if (isFullScreen) return
    if (isComposerEnabled && composerRef.current) {
      composerRef.current.focus()

      // Make sure the cursor is at the end of the input
      if (typeof composerRef.current?.selectionStart == 'number') {
        composerRef.current.selectionStart = composerRef.current.selectionEnd =
          composerRef.current.value.length
      }
    }

    return () => {
      if (composerRef.current?.value) {
        dispatch(saveDraft({ message: composerRef.current.value }))
      }
    }
  }, [isFullScreen, isComposerEnabled, composerRef])

  return (
    <MessengerFooter
      ref={composerRef}
      disabled={!isComposerEnabled}
      placeholder="Type a message"
      inputAriaLabel="Type a message"
      sendButtonTooltip="Send message"
      sendButtonAriaLabel="Send message"
      value={initialValue}
      onChange={onChange}
      onSendMessage={onSendMessage}
    />
  )
}

export default Footer
