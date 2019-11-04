import React from 'react'

import { ThemeProvider } from '@zendeskgarden/react-theming'
import { Widget, Header } from 'src/components/Widget'
import { CenteredDiv, LoadingSpinner } from './styles'

const LoadingPage = () => {
  return (
    <Widget>
      <Header />
      <CenteredDiv>
        <ThemeProvider>
          <LoadingSpinner size="4rem" />
        </ThemeProvider>
      </CenteredDiv>
    </Widget>
  )
}

export default LoadingPage
