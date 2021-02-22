import { Widget, Header, Main, Footer } from 'src/components/Widget'
import { CenteredDiv, LoadingSpinner } from './styles'

const LoadingPage = () => {
  return (
    <Widget>
      <Header />
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
