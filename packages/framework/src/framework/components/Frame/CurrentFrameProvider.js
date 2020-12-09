import { createContext, useContext } from 'react'

const CurrentFrameContext = createContext({ document, window })

const useCurrentFrame = () => {
  return useContext(CurrentFrameContext)
}

const CurrentFrameConsumer = CurrentFrameContext.Consumer

export default CurrentFrameContext.Provider

export { useCurrentFrame, CurrentFrameConsumer }
