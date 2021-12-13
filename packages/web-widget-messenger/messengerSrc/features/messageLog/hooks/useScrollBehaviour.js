import { FORM_ERROR } from 'final-form'
import { rem, stripUnit } from 'polished'
import { useRef, useLayoutEffect, useCallback, useContext } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { ThemeContext } from 'styled-components'
import { win } from '@zendesk/widget-shared-services'
import { useCurrentFrame } from '@zendesk/widget-shared-services/Frame'
import { useShouldDisableAnimations } from 'messengerSrc/features/animations/useDisableAnimationProps'
import { AnimationContext } from 'messengerSrc/features/widget/components/WidgetFrame/FrameAnimation'
import {
  getLastReadTimestamp,
  getLastUnreadTimestamp,
  markAsRead,
} from 'messengerSrc/store/unreadIndicator'
import { getIsWidgetOpen } from 'messengerSrc/store/visibility'

const scrollOffsetInRems = 3

const useScrollBehaviour = ({ messages, anchor, container }) => {
  const dispatch = useDispatch()
  const isScrollAtBottom = useRef(true)
  const firstRender = useRef(true)
  const lastReadTimestamp = useSelector(getLastReadTimestamp)
  const lastUnreadTimestamp = useSelector(getLastUnreadTimestamp)
  const widgetOpen = useSelector(getIsWidgetOpen)
  const theme = useContext(ThemeContext)
  const animationsDisabled = useShouldDisableAnimations()
  const frame = useCurrentFrame()
  const isAnimationComplete = useContext(AnimationContext)

  const scrollToBottom = useCallback(
    ({ smooth = true } = {}) => {
      if (isAnimationComplete) {
        anchor.current?.scrollIntoView({
          behavior: smooth && !animationsDisabled ? 'smooth' : undefined,
          block: 'nearest',
        })

        isScrollAtBottom.current = true
      }
    },
    [animationsDisabled, isAnimationComplete]
  )

  const scrollToBottomIfNeeded = useCallback(
    (options) => {
      if (isScrollAtBottom.current && widgetOpen) {
        setTimeout(() => {
          scrollToBottom(options)
        }, 0)
      }
    },
    [scrollToBottom, widgetOpen]
  )

  const onScroll = useCallback(
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
      input.focus()
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

    win.addEventListener('resize', onResize)

    return () => {
      win.removeEventListener('resize', onResize)
    }
  }, [])

  return {
    onScroll,
    scrollToBottomIfNeeded,
    scrollToBottom,
    scrollToFirstError,
  }
}

export default useScrollBehaviour
