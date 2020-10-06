import { useRef, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import {
  getHasPrevious,
  getHasFetchedConversation,
  fetchPaginatedMessages,
  getIsFetchingHistory
} from 'src/apps/messenger/features/messageLog/store'
import useSafeState from 'src/hooks/useSafeState'

const useFetchMessages = ({ messages, container }) => {
  const lastScrollTop = useRef(0)
  const dispatch = useDispatch()
  const hasPrevious = useSelector(getHasPrevious)
  const hasFetchedConversations = useSelector(getHasFetchedConversation)
  const isFetchingHistory = useSelector(getIsFetchingHistory)
  const [scrollHeightOnHistoryFetch, setScrollHeightOnHistoryFetch] = useSafeState(null)

  const retryFetchMessages = () => {
    if (isFetchingHistory) return

    dispatch(
      fetchPaginatedMessages({
        cursor: messages[0]?.received,
        callback: () => {
          setScrollHeightOnHistoryFetch(container?.current?.scrollHeight)
        }
      })
    )
  }

  // Fetch existing conversations on initial load
  useEffect(() => {
    if (hasFetchedConversations) return
    dispatch(fetchPaginatedMessages({}))
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
      dispatch(
        fetchPaginatedMessages({
          cursor: messages[0].received,
          callback: () => {
            setScrollHeightOnHistoryFetch(container?.current?.scrollHeight)
          }
        })
      )
    }
    lastScrollTop.current = container.current.scrollTop
  }

  return {
    onScrollTop,
    retryFetchMessages
  }
}

export default useFetchMessages
