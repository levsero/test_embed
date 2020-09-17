import { useRef, useEffect } from 'react'
import { rem, stripUnit } from 'polished'
import { baseFontSize } from 'src/apps/messenger/features/themeProvider'
import hostPageWindow from 'src/framework/utils/hostPageWindow'
import useFetchMessages from './useFetchMessages'

const scrollOffsetInRems = 3

const useScrollBehaviour = ({ messages, container }) => {
  const isScrollCloseToBottom = useRef(true)
  const { fetchHistoryOnScrollTop, isLoading, isFetchingHistory } = useFetchMessages({
    container,
    messages
  })

  // Scroll to the bottom on first render
  useEffect(() => {
    container.current.scrollTop = container.current.scrollHeight

    const onResize = () => {
      if (isScrollCloseToBottom.current) {
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
    if (isScrollCloseToBottom.current) {
      setTimeout(() => {
        container.current.scrollTop = container.current.scrollHeight
      }, 0)
    }
  }, [messages])

  const setIsCloseToBottom = event => {
    const pxFromBottom =
      event.target.scrollHeight - event.target.clientHeight - event.target.scrollTop
    const remFromBottom = stripUnit(rem(pxFromBottom, baseFontSize))
    isScrollCloseToBottom.current = remFromBottom <= scrollOffsetInRems
  }

  return {
    onScroll: event => {
      setIsCloseToBottom(event)
      fetchHistoryOnScrollTop()
    },
    isLoading,
    isFetchingHistory
  }
}

export default useScrollBehaviour
