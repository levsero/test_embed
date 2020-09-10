import { useRef, useEffect } from 'react'
import { rem, stripUnit } from 'polished'
import { baseFontSize } from 'src/apps/messenger/features/themeProvider'
import hostPageWindow from 'src/framework/utils/hostPageWindow'

const scrollOffsetInRems = 3

const useScrollBehaviour = ({ messages, container }) => {
  const isScrollAtBottom = useRef(true)

  // Scroll to the bottom on first render
  useEffect(() => {
    container.current.scrollTop = container.current.scrollHeight

    const onResize = () => {
      if (isScrollAtBottom.current) {
        container.current.scrollTop = container.current.scrollHeight
      }
    }

    hostPageWindow.addEventListener('resize', onResize)
    return () => {
      hostPageWindow.removeEventListener('resize', onResize)
    }
  }, [])

  // When messages change, scroll to the bottom if the user was previously at the bottom
  useEffect(() => {
    if (isScrollAtBottom.current) {
      container.current.scrollTop = container.current.scrollHeight
    }
  }, [messages])

  return event => {
    const pxFromBottom =
      event.target.scrollHeight - event.target.clientHeight - event.target.scrollTop
    const remFromBottom = stripUnit(rem(pxFromBottom, baseFontSize))

    isScrollAtBottom.current = remFromBottom <= scrollOffsetInRems
  }
}

export default useScrollBehaviour
