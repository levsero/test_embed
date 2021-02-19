import { createContext, useContext } from 'react'

const OnBackContext = createContext(() => undefined)

const useOnBack = () => {
  return useContext(OnBackContext)
}

export default OnBackContext.Provider

export { useOnBack }
