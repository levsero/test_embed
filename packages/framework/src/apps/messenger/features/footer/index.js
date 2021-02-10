import React, { useEffect, useRef } from 'react'
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
import { restoreHostPageScrollPositionIfSafari } from 'src/framework/utils/hostPageWindow'

const Footer = () => {
  const dispatch = useDispatch()
  const composerRef = useRef(null)
  const isComposerEnabled = useSelector(getIsComposerEnabled)
  const isFullScreen = useSelector(getIsFullScreen)
  const composerDraft = useSelector(getComposerDraft)

  const onSendMessage = message => {
    if (message.trim().length === 0) {
      return
    }
    dispatch(sendMessage({ message }))
    stopTyping()
  }

  const onChange = _e => {
    startTyping()
  }

  useEffect(() => {
    if (isFullScreen) return
    if (isComposerEnabled && composerRef.current) {
      restoreHostPageScrollPositionIfSafari(() => {
        composerRef.current.focus()
      })

      // Make sure the cursor is at the end of the input
      if (typeof composerRef.current?.selectionStart == 'number') {
        composerRef.current.selectionStart = composerRef.current.selectionEnd =
          composerRef.current.value.length
      }
    }

    return () => {
      if (composerRef.current) {
        dispatch(saveDraft({ message: composerRef.current.value }))
      }
    }
  }, [isFullScreen, isComposerEnabled, composerRef])

  return (
    <MessengerFooter
      ref={composerRef}
      disabled={!isComposerEnabled}
      initialValue={composerDraft}
      onChange={onChange}
      onSendMessage={onSendMessage}
    />
  )
}

export default Footer
