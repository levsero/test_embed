import {
  CenterSpinnerContainer,
  TopSpinnerContainer,
  TopLoadingErrorContainer,
  CenterLoadingErrorContainer,
  CenterLoadingErrorTitle,
  CenterLoadingErrorDescription
} from './styles'

const CenterSpinner = () => {
  return (
    <CenterSpinnerContainer>
      <Spinner />
    </CenterSpinnerContainer>
  )
}

const TopSpinner = () => {
  return (
    <TopSpinnerContainer>
      <Spinner />
    </TopSpinnerContainer>
  )
}

const TopLoadingError = () => {
  return (
    <TopLoadingErrorContainer>
      Messages failed to load <ReloadStroke />
    </TopLoadingErrorContainer>
  )
}

const CenterLoadingError = () => {
  return (
    <CenterLoadingErrorContainer>
      <CenterLoadingErrorTitle>Messages failed to load</CenterLoadingErrorTitle>
      <CenterLoadingErrorDescription>
        click to retry <ReloadStroke />
      </CenterLoadingErrorDescription>
    </CenterLoadingErrorContainer>
  )
}

export { CenterSpinnerContainer, TopSpinnerContainer, TopLoadingError, CenterLoadingError }
