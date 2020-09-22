import { useRef, useLayoutEffect, useCallback } from 'react'
import { rem, stripUnit } from 'polished'
import { baseFontSize } from 'src/apps/messenger/features/themeProvider'
import hostPageWindow from 'src/framework/utils/hostPageWindow'

const scrollOffsetInRems = 3

const scrollToBottomUntilHeightSettled = async (container, isScrollAtBottom) => {
  let previousScrollHeight = null

  while (container.current.scrollHeight !== previousScrollHeight) {
    if (!container.current || !isScrollAtBottom.current) {
      return
    }

    await new Promise(res => {
      requestAnimationFrame(() => {
        if (!container.current || !isScrollAtBottom.current) {
          return
        }

        container.current.scrollTop = container.current.scrollHeight
        previousScrollHeight = container.current.scrollHeight

        res()
      })
    })
  }
}

const useScrollBehaviour = ({ messages, container }) => {
  const isScrollAtBottom = useRef(true)
  const isScrollingToBottom = useRef(false)

  const scrollToBottomIfNeeded = useCallback(() => {
    if (isScrollAtBottom.current) {
      if (isScrollingToBottom.current) {
        return
      }

      isScrollingToBottom.current = true
      scrollToBottomUntilHeightSettled(container, isScrollAtBottom)
        .then(() => {
          isScrollingToBottom.current = false
        })
        .catch(() => {
          isScrollingToBottom.current = false
        })
    }
  }, [])

  const onScrollBottom = useCallback(event => {
    const pxFromBottom =
      event.target.scrollHeight - event.target.clientHeight - event.target.scrollTop
    const remFromBottom = stripUnit(rem(pxFromBottom, baseFontSize))

    isScrollAtBottom.current = remFromBottom <= scrollOffsetInRems
  }, [])

  useLayoutEffect(() => {
    scrollToBottomIfNeeded()
    hostPageWindow.addEventListener('resize', scrollToBottomIfNeeded)

    return () => {
      hostPageWindow.removeEventListener('resize', scrollToBottomIfNeeded)
    }
  }, [])

  // When messages change, scroll to the bottom if the user was previously at the bottom
  useLayoutEffect(() => {
    if (isScrollAtBottom.current) {
      scrollToBottomIfNeeded()
    }
  }, [messages])

  return {
    onScrollBottom,
    scrollToBottomIfNeeded
  }
}

export default useScrollBehaviour
