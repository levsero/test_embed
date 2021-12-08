import { useEffect, useRef, useContext } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { MessengerFooter } from '@zendesk/conversation-components'
import { SUPPORTED_FILE_TYPES } from '@zendesk/sunco-js-client'
import isFeatureEnabled from 'src/embeds/webWidget/selectors/feature-flags'
import useSendFiles from 'messengerSrc/features/app/hooks/useSendFiles'
import {
  getComposerDraft,
  getIsComposerEnabled,
  saveDraft,
} from 'messengerSrc/features/footer/store'
import { stopTyping, startTyping } from 'messengerSrc/features/footer/typing'
import { sendMessage } from 'messengerSrc/features/messageLog/store'
import { getIsFullScreen } from 'messengerSrc/features/responsiveDesign/store'
import { AnimationContext } from 'messengerSrc/features/widget/components/WidgetFrame/FrameAnimation'

// Because this was using a variant which was deleted as part of hostPageWindow and operates differently to the @zendesk/widget-shared-services isSafari()
const isSafari = /^((?!chrome|android).)*safari/i.test(navigator.userAgent)

const Footer = () => {
  const dispatch = useDispatch()
  const composerRef = useRef(null)
  const isComposerEnabled = useSelector(getIsComposerEnabled)
  const isFullScreen = useSelector(getIsFullScreen)
  const composerDraft = useSelector(getComposerDraft)
  const isAnimationComplete = useContext(AnimationContext)
  const { onFilesSelected } = useSendFiles()

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
    if (isComposerEnabled && composerRef.current && isAnimationComplete) {
      if (!isSafari) {
        composerRef.current?.focus()
      }

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
  }, [isFullScreen, isComposerEnabled, composerRef, isAnimationComplete])

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
