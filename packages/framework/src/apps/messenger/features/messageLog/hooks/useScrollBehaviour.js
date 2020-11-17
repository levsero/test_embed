import { useRef, useLayoutEffect, useCallback, createContext, useContext } from 'react'
import { rem, stripUnit } from 'polished'
import hostPageWindow from 'src/framework/utils/hostPageWindow'
import {
  getLastReadTimestamp,
  getLastUnreadTimestamp,
  markAsRead
} from 'src/apps/messenger/store/unreadIndicator'
import { useDispatch, useSelector } from 'react-redux'
import { ThemeContext } from 'styled-components'

const ScrollContext = createContext({ scrollToBottomIfNeeded: () => null })
const ScrollProvider = ScrollContext.Provider

const scrollOffsetInRems = 3

const useScrollBehaviour = ({ messages, anchor, container }) => {
  const dispatch = useDispatch()
  const isScrollAtBottom = useRef(true)
  const lastReadTimestamp = useSelector(getLastReadTimestamp)
  const lastUnreadTimestamp = useSelector(getLastUnreadTimestamp)
  const theme = useContext(ThemeContext)

  const scrollToBottom = useCallback(({ smooth = true } = {}) => {
    anchor.current?.scrollIntoView({ behavior: smooth ? 'smooth' : undefined })
    isScrollAtBottom.current = true
  }, [])

  const scrollToBottomIfNeeded = useCallback(() => {
    if (isScrollAtBottom.current) {
      scrollToBottom()
    }
  }, [scrollToBottom])

  const onScrollBottom = useCallback(
    event => {
      const pxFromBottom =
        event.target.scrollHeight - event.target.clientHeight - event.target.scrollTop
      const remFromBottom = stripUnit(rem(pxFromBottom, theme.messenger.baseFontSize))

      isScrollAtBottom.current = remFromBottom <= scrollOffsetInRems

      if (isScrollAtBottom.current && lastUnreadTimestamp) {
        dispatch(markAsRead({ lastMessageTimestamp: lastUnreadTimestamp }))
      }
    },
    [lastUnreadTimestamp]
  )

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

  useLayoutEffect(() => {
    container.current.scrollTop = container.current.scrollHeight

    hostPageWindow.addEventListener('resize', scrollToBottomIfNeeded)

    return () => {
      hostPageWindow.removeEventListener('resize', scrollToBottomIfNeeded)
    }
  }, [])

  return {
    onScrollBottom,
    scrollToBottomIfNeeded,
    scrollToBottom
  }
}

const useScroll = () => {
  return useContext(ScrollContext)
}

export default useScrollBehaviour
export { useScroll, ScrollProvider }
