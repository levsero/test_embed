import React, { useRef, useEffect, useState, useCallback } from 'react'
import ReactDOM from 'react-dom'
import { StyleSheetManager } from 'styled-components'
import PropTypes from 'prop-types'
import CurrentFrameProvider, { useCurrentFrame, CurrentFrameConsumer } from './CurrentFrameProvider'

const useCombinedRefs = extraRef => {
  const targetRef = useRef(null)

  const setRef = useCallback(
    ref => {
      targetRef.current = ref
      if (!extraRef) return

      if (typeof extraRef === 'function') {
        extraRef(targetRef.current)
      } else {
        extraRef.current = targetRef.current
      }
    },
    [targetRef, extraRef]
  )

  return [targetRef, setRef]
}

const Frame = React.forwardRef(({ children, rootElement, title, hidden, ...props }, forwardRef) => {
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

  const frameStyles = { ...props.style }

  if (!loaded || !isTargetReady || hidden) {
    frameStyles.display = 'none'
  }

  return (
    <iframe ref={frameRef} title={title} {...props} style={frameStyles}>
      {loaded && isTargetReady && (
        <StyleSheetManager target={frame.current.contentDocument.querySelector('head')}>
          <CurrentFrameProvider
            value={{
              document: frame.current.contentDocument,
              window: frame.current.contentWindow
            }}
          >
            {!hidden && ReactDOM.createPortal(children, container.current)}
          </CurrentFrameProvider>
        </StyleSheetManager>
      )}
    </iframe>
  )
})

Frame.propTypes = {
  children: PropTypes.node,
  rootElement: PropTypes.instanceOf(Element),
  title: PropTypes.string.isRequired,
  hidden: PropTypes.bool,
  style: PropTypes.object
}

export default Frame
export { useCurrentFrame, CurrentFrameConsumer }
