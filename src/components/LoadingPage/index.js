import React from 'react'

import { Widget, Header } from 'src/components/Widget'
import { CenteredDiv, LoadingSpinner } from './styles'

const LoadingPage = () => {
  return (
    <Widget>
      <Header />
      <CenteredDiv>
        <LoadingSpinner size="4rem" />
      </CenteredDiv>
    </Widget>
  )
}

export default LoadingPage
