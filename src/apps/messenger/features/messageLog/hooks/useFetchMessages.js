import { useRef, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { getClient } from 'src/apps/messenger/suncoClient'
import {
  messagesReceived,
  getHasPrevious,
  getHasFetchedConversation
} from 'src/apps/messenger/features/messageLog/store'
import useSafeState from 'src/hooks/useSafeState'

const useFetchMessages = ({ messages, container }) => {
  const lastScrollTop = useRef(0)
  const dispatch = useDispatch()
  const hasPrevious = useSelector(getHasPrevious)
  const hasFetchedConversations = useSelector(getHasFetchedConversation)
  const [isFetchingHistory, setIsFetchingHistory] = useSafeState(false)
  const [errorFetchingHistory, setErrorFetchingHistory] = useSafeState(false)
  const [scrollHeightOnHistoryFetch, setScrollHeightOnHistoryFetch] = useSafeState(null)

  const fetchPaginatedMessages = cursor => {
    getClient()
      .listMessages(cursor)
      .then(response => {
        setTimeout(() => {
          if (cursor) {
            setScrollHeightOnHistoryFetch(container?.current?.scrollHeight)
          }

          setErrorFetchingHistory(false)
          setIsFetchingHistory(false)
          dispatch(messagesReceived({ ...response.body }))
        }, 1500)
      })
      .catch(() => {
        setIsFetchingHistory(false)
        setErrorFetchingHistory(true)
      })
  }

  const retryFetchMessages = () => {
    if (isFetchingHistory) return
    setIsFetchingHistory(true)

    fetchPaginatedMessages(messages[0]?.received)
  }

  // Fetch existing conversations on initial load
  useEffect(() => {
    if (hasFetchedConversations) return
    setIsFetchingHistory(true)
    fetchPaginatedMessages()
  }, [])

  // Maintain scroll position on conversation load
  useEffect(() => {
    if (!scrollHeightOnHistoryFetch) return

    // container.current.scrollTop does not interact correctly with scrolling while it's updating
    const scrollTop = lastScrollTop.current
    const scrollHeight = container.current.scrollHeight
    const lengthDifference = scrollHeight - scrollHeightOnHistoryFetch

    // When conversation history is fetched, we record the scroll just before
    // the component updates in order to adjust the  scrollTop
    // by the difference in container height of pre and post update.
    if (lengthDifference !== 0) {
      container.current.scrollTop = scrollTop + lengthDifference
      setScrollHeightOnHistoryFetch(null)
    }
  }, [messages])

  const onScrollTop = () => {
    if (container.current.scrollTop === 0 && hasPrevious && !isFetchingHistory) {
      setIsFetchingHistory(true)
      fetchPaginatedMessages(messages[0].received)
    }
    lastScrollTop.current = container.current.scrollTop
  }

  return {
    onScrollTop,
    isFetchingHistory,
    errorFetchingHistory,
    retryFetchMessages
  }
}

export default useFetchMessages
