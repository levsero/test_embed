import { useRef } from 'react'
import { keyCodes } from 'classicSrc/util/keyboard'

const useOnMultilineSubmit = (onSubmit) => {
  const isComposing = useRef(false)
  const compositionHasJustEnded = useRef(false)

  const handleCompositionStart = () => (isComposing.current = true)
  const handleCompositionEnd = () => {
    isComposing.current = false
    compositionHasJustEnded.current = true
  }

  // If Enter key is part of an IME or multi-line composition, don't submit the text.
  // The e.nativeEvent.isComposing, isComposing and compositionHasJustEnded flags
  // support composing text in foreign languages and order of keypress events across browsers.
  // See https://github.com/threema-ch/threema-web/issues/777
  const handleKeyDown = (e) => {
    if (e.key === keyCodes.ENTER && !e.shiftKey) {
      if (e.nativeEvent.isComposing || isComposing.current || compositionHasJustEnded.current) {
        return
      }

      e.preventDefault()
      onSubmit()
    }
  }

  const handleKeyUp = () => {
    compositionHasJustEnded.current = false
  }

  return { handleCompositionStart, handleCompositionEnd, handleKeyDown, handleKeyUp }
}

export default useOnMultilineSubmit
