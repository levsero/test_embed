import { useEffect, useRef, useState, useContext } from 'react'
import { ThemeContext } from 'styled-components'
import { stripUnit } from 'polished'
import { scrollPadding } from './styles'

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
    const childRect = child.getBoundingClientRect()

    // If the start of the slide is off screen to the left
    if (childRect.left < containerRect.left) {
      // If the element at least three quarters visible
      if (childRect.right >= containerRect.left + childRect.width * 0.75) {
        items.push(i)
      }

      // If the end of the slide is off screen to the right
    } else if (childRect.left < containerRect.right && childRect.right > containerRect.right) {
      // If the element is at least three quarters visible
      if (containerRect.right - childRect.left >= childRect.width * 0.75) {
        items.push(i)
      }

      // If the slide is completely visible
    } else if (childRect.left >= containerRect.left && childRect.right <= containerRect.right) {
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
    let currentContainer = containerRef.current
    const onScroll = () => {
      setVisibleItems(getVisibleItems(currentContainer))
    }

    currentContainer.addEventListener('scroll', onScroll)
    onScroll()

    return () => {
      currentContainer.removeEventListener('scroll', onScroll)
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
