import { useEffect, useRef } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { MessengerFooter } from '@zendesk/conversation-components'
import { SUPPORTED_FILE_TYPES } from '@zendesk/sunco-js-client'
import {
  getComposerDraft,
  getIsComposerEnabled,
  saveDraft,
} from 'src/apps/messenger/features/footer/store'
import { stopTyping, startTyping } from 'src/apps/messenger/features/footer/typing'
import { sendMessage, sendFile } from 'src/apps/messenger/features/messageLog/store'
import { getIsFullScreen } from 'src/apps/messenger/features/responsiveDesign/store'
import isFeatureEnabled from 'src/embeds/webWidget/selectors/feature-flags'
import { restoreHostPageScrollPositionIfSafari } from 'src/framework/utils/hostPageWindow'

const Footer = () => {
  const dispatch = useDispatch()
  const composerRef = useRef(null)
  const isComposerEnabled = useSelector(getIsComposerEnabled)
  const isFullScreen = useSelector(getIsFullScreen)
  const composerDraft = useSelector(getComposerDraft)
  const onFilesSelected = (files) => {
    Array.from(files).forEach((file) => {
      dispatch(sendFile({ file }))
    })
  }

  const onSendMessage = (message) => {
    if (message.trim().length === 0) {
      return
    }
    dispatch(sendMessage({ message }))
    stopTyping()
  }

  const onChange = (_e) => {
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
      onFilesSelected={onFilesSelected}
      isFileInputVisible={isFeatureEnabled(undefined, 'web_widget_messenger_file_uploads')}
      allowedFileTypes={SUPPORTED_FILE_TYPES}
    />
  )
}

export default Footer
