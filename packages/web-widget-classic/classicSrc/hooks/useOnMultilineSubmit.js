import { useRef } from 'react'
import { keyCodes } from 'classicSrc/util/keyboard'

const useOnMultilineSubmit = (onSubmit) => {
  const isComposing = useRef(false)
  const handleCompositionStart = () => (isComposing.current = true)
  const handleCompositionEnd = () => (isComposing.current = false)

  // event.nativeEvent.isComposing and isComposing flag are used
  // to support composing text in foreign languages across browsers.
  const handleKeyDown = (e) => {
    if (
      e.key === keyCodes.ENTER &&
      !e.shiftKey &&
      !e.nativeEvent.isComposing &&
      !isComposing.current
    ) {
      e.preventDefault()
      onSubmit()
    }
  }

  return { handleCompositionStart, handleCompositionEnd, handleKeyDown }
}

export default useOnMultilineSubmit
