import { useRef, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import useSafeState from '@zendesk/widget-shared-services/util/useSafeState'
import { hasExistingAppUser } from 'messengerSrc/api/sunco'
import {
  getHasPrevious,
  fetchPaginatedMessages,
  getIsFetchingHistory,
} from 'messengerSrc/features/messageLog/store'
import { startConversation } from 'messengerSrc/features/suncoConversation/store'

const useFetchMessages = ({ messages, container }) => {
  const lastScrollTop = useRef(0)
  const dispatch = useDispatch()
  const hasPrevious = useSelector(getHasPrevious)
  const isFetchingHistory = useSelector(getIsFetchingHistory)
  const [scrollHeightOnHistoryFetch, setScrollHeightOnHistoryFetch] = useSafeState(null)

  const retryFetchMessages = () => {
    if (!hasExistingAppUser()) {
      dispatch(startConversation())
    } else {
      if (isFetchingHistory) return

      dispatch(
        fetchPaginatedMessages({
          cursor: messages[0]?.received,
          callback: () => {
            setScrollHeightOnHistoryFetch(container?.current?.scrollHeight)
          },
        })
      )
    }
  }

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
          },
        })
      )
    }
    lastScrollTop.current = container.current.scrollTop
  }

  return {
    onScrollTop,
    retryFetchMessages,
  }
}

export default useFetchMessages
