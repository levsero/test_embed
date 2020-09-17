import { useRef, useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { getClient } from 'src/apps/messenger/suncoClient'
import { getHasPrevious } from 'src/apps/messenger/features/messageLog/store'
import { messagesReceived } from 'src/apps/messenger/features/messageLog/store'

const useFetchMessages = ({ messages, container }) => {
  const lastScrollTop = useRef(0)
  const dispatch = useDispatch()
  const hasPrevious = useSelector(getHasPrevious)
  const [isLoading, setIsLoading] = useState(false)
  const [isFetchingHistory, setIsFetchingHistory] = useState(false)
  const [scrollHeightOnHistoryFetch, setScrollHeightOnHistoryFetch] = useState(null)

  const fetchConversations = cursor => {
    getClient()
      .activeConversation.listMessages(cursor)
      .then(response => {
        if (cursor) {
          setScrollHeightOnHistoryFetch(container.current.scrollHeight)
        }

        setIsLoading(false)
        setIsFetchingHistory(false)
        dispatch(messagesReceived({ messages: response.body }))
      })
  }

  // Fetch existing conversations on load
  useEffect(() => {
    if (messages.length > 0) return
    setIsLoading(true)
    fetchConversations()
  }, [])

  // Maintain scroll position on history load
  useEffect(() => {
    if (!scrollHeightOnHistoryFetch) return

    // container.current.scrollTop does not interact correctly with scrolling while it's updating
    const scrollTop = lastScrollTop.current
    const scrollHeight = container.current.scrollHeight
    const lengthDifference = scrollHeight - scrollHeightOnHistoryFetch

    // When chat history is fetched, we record the scroll just before
    // the component updates in order to adjust the  scrollTop
    // by the difference in container height of pre and post update.
    if (lengthDifference !== 0) {
      container.current.scrollTop = scrollTop + lengthDifference
      setScrollHeightOnHistoryFetch(null)
    }
  }, [messages])

  const fetchHistoryOnScrollTop = () => {
    if (container.current.scrollTop === 0 && hasPrevious && !isFetchingHistory) {
      setIsFetchingHistory(true)
      fetchConversations(messages[0].received)
    }
    lastScrollTop.current = container.current.scrollTop
  }

  return {
    fetchHistoryOnScrollTop,
    isLoading,
    isFetchingHistory
  }
}

export default useFetchMessages
