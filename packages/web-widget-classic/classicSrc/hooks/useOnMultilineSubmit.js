import { useRef } from 'react'
import { isSafari } from '@zendesk/widget-shared-services'
import { keyCodes } from 'classicSrc/util/keyboard'

const useOnMultilineSubmit = (onSubmit) => {
  const formingNewWordInJapanese = useRef(false)

  const handleCompositionStart = () => (formingNewWordInJapanese.current = true)
  const handleCompositionEnd = () => (formingNewWordInJapanese.current = true)

  // If Enter key is part of an IME or multi-line composition, don't submit the text.
  // The e.nativeEvent.isComposing and formingNewWordInJapanese flags
  // support composing text in foreign languages and order of keypress events across browsers.
  // See https://github.com/threema-ch/threema-web/issues/777
  const handleKeyDown = (e) => {
    if (e.key === keyCodes.ENTER && e.shiftKey) {
      return
    } else if (e.key === keyCodes.ENTER) {
      if (e.nativeEvent.isComposing) return
      if (isSafari() && formingNewWordInJapanese.current) return

      e.preventDefault()
      onSubmit()
    }
  }

  const handleKeyUp = () => (formingNewWordInJapanese.current = false)

  return { handleCompositionStart, handleCompositionEnd, handleKeyDown, handleKeyUp }
}

export default useOnMultilineSubmit
