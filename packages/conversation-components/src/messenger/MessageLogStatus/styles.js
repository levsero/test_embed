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

const HistoryErrorContainer = styled.div`
  display: flex;
  justify-content: center;
  padding-top: ${(props) => props.theme.messenger.space.sm};
  font-size: ${(props) => props.theme.messenger.fontSizes.sixteen};
  &&& {
    color: ${(props) => props.theme.palette.grey[800]};
  }
`

const HistorySpinnerContainer = styled.div`
  display: flex;
  justify-content: center;
  padding-top: ${(props) => props.theme.messenger.space.sm};
  font-size: ${(props) => props.theme.messenger.fontSizes.xl};
`

export {
  SpinnerContainer,
  ErrorContainer,
  ErrorTitle,
  HistoryErrorContainer,
  HistorySpinnerContainer,
}
