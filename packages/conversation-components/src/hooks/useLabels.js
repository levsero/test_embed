import { useContext } from 'react'
import { ThemeContext } from 'styled-components'

const useLabel = () => {
  const themeContext = useContext(ThemeContext)

  return themeContext.messenger.labels
}

export default useLabel
