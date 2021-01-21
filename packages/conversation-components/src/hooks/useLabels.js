import { useContext } from 'react'
import { ThemeContext } from 'styled-components'

const useLabels = () => {
  const themeContext = useContext(ThemeContext)

  return themeContext.messenger.labels
}

export default useLabels
