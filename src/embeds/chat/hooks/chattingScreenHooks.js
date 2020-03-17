import { HISTORY_REQUEST_STATUS } from 'constants/chat'
import { useState, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { isAgent } from 'utility/chat'
import {
  getChatsLength,
  hasUnseenAgentMessage,
  getLastMessageAuthor,
  getAgentsTyping
} from 'src/redux/modules/chat/chat-selectors'
import {
  getHistoryLength,
  getHistoryRequestStatus
} from 'src/redux/modules/chat/chat-history-selectors'
import { markAsRead } from 'src/redux/modules/chat'
import getScrollBottom from 'utility/get-scroll-bottom'

export const useMessagesOnMount = (scrollToBottom, isScrollCloseToBottom) => {
  const dispatch = useDispatch()
  const chatsLength = useSelector(getChatsLength)
  const historyLength = useSelector(getHistoryLength)
  const unreadMessages = useSelector(hasUnseenAgentMessage)

  useEffect(() => {
    const hasMessages = chatsLength + historyLength > 0
    if (hasMessages) {
      scrollToBottom()
    }

    if (unreadMessages && isScrollCloseToBottom) {
      dispatch(markAsRead)
    }
  }, [])
}

export const useHistoryUpdate = scrollContainer => {
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
    if (!scrollHeight || !scrollContainer) return

    const scrollTop = scrollContainer.scrollTop
    const scrollPosition = scrollContainer.scrollHeight
    const lengthDifference = scrollPosition - scrollHeight

    // Maintain the current scroll position after adding the new chat history
    if (lengthDifference !== 0) {
      scrollContainer.scrollTop = scrollTop + lengthDifference
    }
    setScrollHeight(null)
  }, [historyRequestStatus])
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

export const useNewMessages = (scrollToBottom, isScrollCloseToBottom) => {
  const dispatch = useDispatch()
  const chatsLength = useSelector(getChatsLength)
  const lastMessageAuthor = useSelector(getLastMessageAuthor)

  useEffect(() => {
    if (isScrollCloseToBottom && isAgent(lastMessageAuthor)) {
      dispatch(markAsRead)
    }

    if (isScrollCloseToBottom || lastMessageAuthor === 'visitor') {
      scrollToBottom()
    }
  }, [chatsLength, lastMessageAuthor])
}
