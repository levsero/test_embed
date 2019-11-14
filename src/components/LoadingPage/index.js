import React from 'react'

import { Widget, Header, Main, Footer } from 'src/components/Widget'
import { CenteredDiv, LoadingSpinner } from './styles'

const LoadingPage = () => {
  return (
    <Widget>
      <Header showBackButton={false} />
      <Main>
        <CenteredDiv>
          <LoadingSpinner size="4rem" />
        </CenteredDiv>
      </Main>
      <Footer />
    </Widget>
  )
}

export default LoadingPage
