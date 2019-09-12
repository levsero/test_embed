import React, { useRef, useEffect, useState } from 'react'
import ReactDOM from 'react-dom'
import { StyleSheetManager } from 'styled-components'
import PropTypes from 'prop-types'

const useCombinedRefs = (...refs) => {
  const targetRef = useRef(null)

  const setRef = ref => {
    targetRef.current = ref

    refs.forEach(ref => {
      if (!ref) return

      if (typeof ref === 'function') {
        ref(targetRef.current)
      } else {
        ref.current = targetRef.current
      }
    })
  }

  return [targetRef, setRef]
}

const Frame = React.forwardRef(({ children, rootElement, title, ...props }, forwardRef) => {
  const [frame, frameRef] = useCombinedRefs(forwardRef)
  const container = useRef(rootElement)

  const [loaded, setLoaded] = useState(false)
  const [isTargetReady, setIsTargetReady] = useState(false)

  useEffect(() => {
    const onLoad = () => {
      setLoaded(true)
    }

    if (frame.current.contentDocument.readyState === 'complete') {
      onLoad()
      return
    }

    const currentFrame = frame.current

    currentFrame.addEventListener('load', onLoad)
    return () => currentFrame.removeEventListener('load', onLoad())
  }, [frame])

  useEffect(() => {
    if (!loaded) {
      return
    }

    // if a root element is not provided, default to using an empty div
    if (!container.current) {
      container.current = document.createElement('div')
    }

    const currentContainer = container.current
    const currentFrame = frame.current

    currentFrame.contentDocument.body.appendChild(currentContainer)

    setIsTargetReady(true)
    return () => currentFrame.contentDocument.body.removeChild(currentContainer)
  }, [frame, rootElement, loaded])

  return (
    <iframe ref={frameRef} title={title} {...props}>
      {loaded && isTargetReady && (
        <StyleSheetManager target={frame.current.contentDocument.head}>
          <>{ReactDOM.createPortal(children, container.current)}</>
        </StyleSheetManager>
      )}
    </iframe>
  )
})

Frame.propTypes = {
  children: PropTypes.node,
  rootElement: PropTypes.instanceOf(Element),
  title: PropTypes.string.isRequired
}

export default Frame
