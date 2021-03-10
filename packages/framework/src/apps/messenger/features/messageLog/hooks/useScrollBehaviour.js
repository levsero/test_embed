import { useRef, useLayoutEffect, useCallback, useContext } from 'react'
import { rem, stripUnit } from 'polished'
import { useDispatch, useSelector } from 'react-redux'
import { ThemeContext } from 'styled-components'
import { useCurrentFrame } from 'src/framework/components/Frame'
import { FORM_ERROR } from 'final-form'

import hostPageWindow, {
  restoreHostPageScrollPositionIfSafari,
} from 'src/framework/utils/hostPageWindow'
import {
  getLastReadTimestamp,
  getLastUnreadTimestamp,
  markAsRead,
} from 'src/apps/messenger/store/unreadIndicator'
import { useShouldDisableAnimations } from 'src/apps/messenger/features/animations/useDisableAnimationProps'

const scrollOffsetInRems = 3

const useScrollBehaviour = ({ messages, anchor, container }) => {
  const dispatch = useDispatch()
  const isScrollAtBottom = useRef(true)
  const firstRender = useRef(true)
  const lastReadTimestamp = useSelector(getLastReadTimestamp)
  const lastUnreadTimestamp = useSelector(getLastUnreadTimestamp)
  const theme = useContext(ThemeContext)
  const animationsDisabled = useShouldDisableAnimations()
  const frame = useCurrentFrame()

  const scrollToBottom = useCallback(
    ({ smooth = true } = {}) => {
      anchor.current?.scrollIntoView({
        behavior: smooth && !animationsDisabled ? 'smooth' : undefined,
        block: 'nearest',
      })

      isScrollAtBottom.current = true
    },
    [animationsDisabled]
  )

  const scrollToBottomIfNeeded = useCallback(
    (options) => {
      if (isScrollAtBottom.current) {
        setTimeout(() => {
          scrollToBottom(options)
        }, 0)
      }
    },
    [scrollToBottom]
  )

  const onScrollBottom = useCallback(
    (event) => {
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

  // scrollToFirstErroredField will scroll to the first field that has errored
  const scrollToFirstError = useCallback((fields, errors) => {
    const firstFieldToError = fields.concat({ id: FORM_ERROR }).find((field) => errors[field._id])
    if (!firstFieldToError) {
      return
    }
    let input = frame.document.querySelector(`[data-id="${firstFieldToError._id}"]`)
    if (input) {
      restoreHostPageScrollPositionIfSafari(() => {
        input.focus()
      })
    }
    scrollToBottomIfNeeded()
    const label = frame.document.querySelector(`[data-label-id="${firstFieldToError._id}"]`)

    if (label) {
      setTimeout(() => {
        label.scrollIntoView()
      }, 0)
    }
  })

  // When messages change, scroll to the bottom if the user was previously at the bottom
  useLayoutEffect(() => {
    if (!firstRender.current) {
      scrollToBottomIfNeeded()
    }

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
    setTimeout(() => {
      if (container.current) {
        container.current.scrollTop =
          container.current.scrollHeight - container.current.clientHeight
      }
    }, 0)
    firstRender.current = false

    const onResize = () => {
      scrollToBottomIfNeeded({ smooth: false })
    }

    hostPageWindow.addEventListener('resize', onResize)

    return () => {
      hostPageWindow.removeEventListener('resize', onResize)
    }
  }, [])

  return {
    onScrollBottom,
    scrollToBottomIfNeeded,
    scrollToBottom,
    scrollToFirstError,
  }
}

export default useScrollBehaviour
