import styled from 'styled-components'
import { Button } from '@zendeskgarden/react-buttons'

const CenterSpinnerContainer = styled.div`
  display: flex;
  align-items: center;
  flex-direction: column;
  justify-content: center;
  height: 100%;
  font-size: ${props => props.theme.messenger.fontSizes.xxxl};
`

const CenterLoadingErrorContainer = styled.div`
  display: flex;
  align-items: center;
  flex-direction: column;
  justify-content: center;
  height: 100%;
  font-size: ${props => props.theme.messenger.fontSizes.sixteen};
`

const LoadingErrorButton = styled(Button)`
  &&& {
    color: 000;
  }
`

const TopSpinnerContainer = styled.div`
  display: flex;
  justify-content: center;
  margin-top: ${props => props.theme.messenger.space.small};
  font-size: ${props => props.theme.messenger.fontSizes.xl};
`

const TopLoadingErrorContainer = styled.div`
  display: flex;
  justify-content: center;
  margin-top: ${props => props.theme.messenger.space.small};
  font-size: ${props => props.theme.messenger.fontSizes.sixteen};
`

const CenterLoadingErrorTitle = styled.div`
  font-weight: ${props => props.theme.fontWeights.semibold};
  margin-bottom: ${props => props.theme.messenger.space.small};
`
const CenterLoadingErrorDescription = styled.div``

export {
  CenterSpinnerContainer,
  TopSpinnerContainer,
  TopLoadingErrorContainer,
  CenterLoadingErrorContainer,
  CenterLoadingErrorTitle,
  CenterLoadingErrorDescription,
  LoadingErrorButton
}
