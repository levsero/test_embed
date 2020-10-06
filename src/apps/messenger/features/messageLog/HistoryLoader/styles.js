import styled from 'styled-components'
import { zdColorGrey800 } from '@zendeskgarden/css-variables'
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
  &&& {
    color: ${zdColorGrey800};
  }
`

const LoadingErrorButton = styled(Button)`
  &&& {
    color: ${zdColorGrey800};
  }
`

const TopSpinnerContainer = styled.div`
  display: flex;
  justify-content: center;
  padding-top: ${props => props.theme.messenger.space.sm};
  font-size: ${props => props.theme.messenger.fontSizes.xl};
`

const TopLoadingErrorContainer = styled.div`
  display: flex;
  justify-content: center;
  padding-top: ${props => props.theme.messenger.space.sm};
  font-size: ${props => props.theme.messenger.fontSizes.sixteen};
  &&& {
    color: ${zdColorGrey800};
  }
`

const CenterLoadingErrorTitle = styled.div`
  font-weight: ${props => props.theme.fontWeights.semibold};
  margin-bottom: ${props => props.theme.messenger.space.xxs};
`

export {
  CenterSpinnerContainer,
  TopSpinnerContainer,
  TopLoadingErrorContainer,
  CenterLoadingErrorContainer,
  CenterLoadingErrorTitle,
  LoadingErrorButton
}
