import { useRef, useLayoutEffect, useCallback } from 'react'
import { rem, stripUnit } from 'polished'
import { baseFontSize } from 'src/apps/messenger/features/themeProvider'
import hostPageWindow from 'src/framework/utils/hostPageWindow'
import {
  getLastReadTimestamp,
  getLastUnreadTimestamp,
  markAsRead
} from 'src/apps/messenger/store/unreadIndicator'
import { useDispatch, useSelector } from 'react-redux'

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
          res()
        }

        container.current.scrollTop = container.current.scrollHeight
        previousScrollHeight = container.current.scrollHeight

        res()
      })
    })
  }
}

const useScrollBehaviour = ({ messages, container }) => {
  const dispatch = useDispatch()
  const isScrollAtBottom = useRef(true)
  const isScrollingToBottom = useRef(false)
  const lastReadTimestamp = useSelector(getLastReadTimestamp)
  const lastUnreadTimestamp = useSelector(getLastUnreadTimestamp)

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

  const onScrollBottom = useCallback(
    event => {
      const pxFromBottom =
        event.target.scrollHeight - event.target.clientHeight - event.target.scrollTop
      const remFromBottom = stripUnit(rem(pxFromBottom, baseFontSize))

      isScrollAtBottom.current = remFromBottom <= scrollOffsetInRems

      if (isScrollAtBottom.current && lastUnreadTimestamp) {
        dispatch(markAsRead({ lastMessageTimestamp: lastUnreadTimestamp }))
      }
    },
    [lastUnreadTimestamp]
  )

  useLayoutEffect(() => {
    scrollToBottomIfNeeded()
    hostPageWindow.addEventListener('resize', scrollToBottomIfNeeded)

    return () => {
      hostPageWindow.removeEventListener('resize', scrollToBottomIfNeeded)
    }
  }, [])

  // When messages change, scroll to the bottom if the user was previously at the bottom
  useLayoutEffect(() => {
    scrollToBottomIfNeeded()

    if (!isScrollAtBottom.current) {
      return
    }

    if (messages.length === 0 || !lastUnreadTimestamp) {
      return
    }

    if (lastUnreadTimestamp !== lastReadTimestamp || !lastReadTimestamp) {
      dispatch(markAsRead({ lastMessageTimestamp: messages[messages.length - 1].received }))
    }
  }, [messages, lastReadTimestamp])

  return {
    onScrollBottom,
    scrollToBottomIfNeeded
  }
}

export default useScrollBehaviour
