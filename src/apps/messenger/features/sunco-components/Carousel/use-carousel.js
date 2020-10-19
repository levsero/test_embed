import { stripUnit } from 'polished'
import { useEffect, useRef, useState, useContext } from 'react'
import { scrollPadding } from 'src/apps/messenger/features/sunco-components/Carousel/styles'
import { ThemeContext } from 'styled-components'

const remToPx = rem => {
  const fontSize = getComputedStyle(document.documentElement).fontSize

  return stripUnit(rem) * stripUnit(fontSize)
}

const getVisibleItems = container => {
  const containerRect = container.getBoundingClientRect()
  const children = Array.from(container.children)

  const items = []

  for (let i = 1; i < children.length - 1; i++) {
    const child = children[i]
    const rect = child.getBoundingClientRect()

    // If the start of the slide is off screen to the left
    if (rect.left < 0) {
      // If the element at least three quarters visible
      if (rect.right >= rect.width * 0.75) {
        items.push(i)
      }

      // If the end of the slide is off screen to the right
    } else if (rect.left < containerRect.width && rect.right > containerRect.width) {
      // If the element is at least three quarters visible
      if (rect.width - (rect.right - containerRect.width) >= rect.width * 0.75) {
        items.push(i)
      }

      // If the slide is completely visible
    } else if (rect.left >= 0 && rect.right <= containerRect.width) {
      items.push(i)
    }
  }

  return items
}

const useCarousel = ({ items }) => {
  const containerRef = useRef(null)
  const [visibleItems, setVisibleItems] = useState([])
  const theme = useContext(ThemeContext)

  useEffect(() => {
    const onScroll = () => {
      setVisibleItems(getVisibleItems(containerRef.current))
    }

    containerRef.current.addEventListener('scroll', onScroll)
    onScroll()

    return () => {
      containerRef.current.removeEventListener('scroll', onScroll)
    }
  }, [containerRef])

  // The scrollTo function on elements for modern browsers will smoothly scroll to the position
  // For browsers that don't support scrollTo we will manually set the scrollLeft of the element
  const scrollTo = position => {
    if (containerRef.current.scrollTo) {
      containerRef.current.scrollTo({ left: position })
    } else {
      containerRef.current.scrollLeft = position
    }
  }

  const onFocus = element => {
    const newOffset = element.target?.offsetParent?.offsetLeft
    const padding = remToPx(scrollPadding({ theme }))

    scrollTo(newOffset - padding)
  }

  const goToNextPage = () => {
    const lastVisibleIndex = visibleItems[visibleItems.length - 1]
    const indexToScrollTo = lastVisibleIndex + 1

    // If the index to scroll is the last element, just scroll right to the end
    if (indexToScrollTo > items.length - 1) {
      scrollTo(containerRef.current.offsetWidth)
    }

    const childToScrollTo = Array.from(containerRef.current.children)[indexToScrollTo]
    if (!childToScrollTo) {
      return
    }

    scrollTo(childToScrollTo.offsetLeft - remToPx(scrollPadding({ theme })))
  }

  const goToPreviousPage = () => {
    const [firstVisibleIndex] = visibleItems

    const indexToScrollTo = firstVisibleIndex - visibleItems.length

    // If the index we want to scroll to is the first element, just scroll right to the beginning
    // so the avatar is shown in full
    if (indexToScrollTo <= 1) {
      scrollTo(0)
    }

    const childToScrollTo = Array.from(containerRef.current.children)[indexToScrollTo]
    if (!childToScrollTo) {
      return
    }

    const newOffsetLeft = childToScrollTo.offsetLeft - remToPx(scrollPadding({ theme }))

    scrollTo(newOffsetLeft)
  }

  return {
    containerRef,
    goToNextPage,
    goToPreviousPage,
    onFocus,
    isFirstSlideVisible: visibleItems.indexOf(1) > -1,
    isLastSlideVisible: visibleItems.indexOf(items.length) > -1
  }
}

export default useCarousel
