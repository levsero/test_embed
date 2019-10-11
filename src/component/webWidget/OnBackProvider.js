import React, { useContext } from 'react'

const OnBackContext = React.createContext(() => undefined)

const useOnBack = () => {
  return useContext(OnBackContext)
}

export default OnBackContext.Provider

export { useOnBack }
