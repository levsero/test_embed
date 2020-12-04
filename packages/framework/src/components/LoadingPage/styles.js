import styled from 'styled-components'
import { Spinner } from '@zendeskgarden/react-loaders'

export const CenteredDiv = styled.div`
  height: 80%;
  display: flex;
  justify-content: center;
  align-items: center;
`

export const LoadingSpinner = styled(Spinner)`
  color: ${props => props.theme.baseColor} !important;
`
