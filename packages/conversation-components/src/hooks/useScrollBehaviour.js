import { createContext, useContext } from 'react'

const ScrollContext = createContext({
  scrollToBottomIfNeeded: () => null,
  scrollToFirstError: () => null
})
const ScrollProvider = ScrollContext.Provider

const useScroll = () => {
  return useContext(ScrollContext)
}

export { useScroll, ScrollProvider }
