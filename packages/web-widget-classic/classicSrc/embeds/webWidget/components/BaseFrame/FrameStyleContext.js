import PropTypes from 'prop-types'
import { createContext, useState, useContext, useEffect } from 'react'

const FrameStyleContext = createContext({
  style: {},
  setStyle: () => undefined,
})

const FrameStyleProvider = ({ children }) => {
  const [style, setStyle] = useState({})

  return (
    <FrameStyleContext.Provider value={{ style, setStyle }}>{children}</FrameStyleContext.Provider>
  )
}

FrameStyleProvider.propTypes = {
  children: PropTypes.node,
}

const useFrameStyle = (style) => {
  const context = useContext(FrameStyleContext)

  useEffect(() => {
    if (style) {
      context.setStyle(style)
    }

    return () => {
      context.setStyle({})
    }
  }, [style])

  return context.style
}

const FrameStyle = ({ style }) => {
  useFrameStyle(style)

  return null
}

const FrameStyleConsumer = FrameStyleContext.Consumer

export { FrameStyleProvider, FrameStyleConsumer, FrameStyle, useFrameStyle }
