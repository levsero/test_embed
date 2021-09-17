import styled from 'styled-components'
import { zdColorGrey800 } from '@zendeskgarden/css-variables'

const SpinnerContainer = styled.div`
  display: flex;
  align-items: center;
  flex-direction: column;
  justify-content: center;
  height: 100%;
  font-size: ${(props) => props.theme.messenger.fontSizes.xxxl};
`

const ErrorContainer = styled.div`
  display: flex;
  align-items: center;
  flex-direction: column;
  justify-content: center;
  height: 100%;
  font-size: ${(props) => props.theme.messenger.fontSizes.sixteen};
  &&& {
    color: ${zdColorGrey800};
  }
`

const ErrorTitle = styled.div`
  font-weight: ${(props) => props.theme.messenger.fontWeights.semibold};
  margin-bottom: ${(props) => props.theme.messenger.space.xxs};
`

export { SpinnerContainer, ErrorContainer, ErrorTitle }
