import { useState, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { HISTORY_REQUEST_STATUS } from 'src/constants/chat'
import { SCROLL_BOTTOM_THRESHOLD } from 'src/constants/chat'
import { markAsRead } from 'src/redux/modules/chat'
import { getHistoryRequestStatus } from 'src/redux/modules/chat/chat-history-selectors'
import { getChatsLength, getLastMessageAuthor, getAgentsTyping } from 'src/embeds/chat/selectors'
import { isAgent } from 'src/util/chat'
import getScrollBottom from 'src/util/get-scroll-bottom'

export const useMessagesOnMount = (scrollToBottom) => {
  const dispatch = useDispatch()

  useEffect(() => {
    scrollToBottom()
    dispatch(markAsRead())
  }, [])
}

export const useHistoryUpdate = (scrollContainer, scrollToBottom) => {
  const historyRequestStatus = useSelector(getHistoryRequestStatus)
  const [scrollHeight, setScrollHeight] = useState(false)

  useEffect(() => {
    if (!scrollContainer) return
    if (historyRequestStatus === HISTORY_REQUEST_STATUS.PENDING) {
      setScrollHeight(scrollContainer.scrollHeight)
    }
  }, [historyRequestStatus])

  useEffect(() => {
    if (historyRequestStatus !== HISTORY_REQUEST_STATUS.DONE) return
    if (!scrollContainer) return
    if (!scrollHeight) return scrollToBottom()

    const scrollTop = scrollContainer.scrollTop
    const scrollPosition = scrollContainer.scrollHeight
    const lengthDifference = scrollPosition - scrollHeight

    // Maintain the current scroll position after adding the new chat history
    if (lengthDifference !== 0) {
      scrollContainer.scrollTop = scrollTop + lengthDifference
    }
    setScrollHeight(null)
  }, [historyRequestStatus])

  return scrollHeight
}

export const useAgentTyping = (agentTypingRef, scrollContainer, scrollToBottom) => {
  const numAgentsTyping = useSelector(getAgentsTyping).length
  useEffect(() => {
    if (numAgentsTyping === 0) return
    if (!scrollContainer || !agentTypingRef) return
    const scrollBottom = getScrollBottom(scrollContainer)

    if (scrollBottom <= agentTypingRef.offsetHeight) {
      scrollToBottom()
    }
  }, [numAgentsTyping])
}

export const useNewMessages = (scrollToBottom, scrollContainer) => {
  const [prevScrollHeight, setPrevScrollHeight] = useState(false)

  const isScrollCloseToBottom = () => {
    const messageHeight = scrollContainer.scrollHeight - prevScrollHeight
    return getScrollBottom(scrollContainer) < messageHeight + SCROLL_BOTTOM_THRESHOLD
  }

  const dispatch = useDispatch()
  const chatsLength = useSelector(getChatsLength)
  const lastMessageAuthor = useSelector(getLastMessageAuthor)

  useEffect(() => {
    if (!scrollContainer) return
    setPrevScrollHeight(scrollContainer.scrollHeight)

    if (isScrollCloseToBottom() && isAgent(lastMessageAuthor)) {
      dispatch(markAsRead())
    }

    if (isScrollCloseToBottom() || lastMessageAuthor === 'visitor') {
      scrollToBottom()
    }
  }, [chatsLength, lastMessageAuthor, prevScrollHeight])
}
