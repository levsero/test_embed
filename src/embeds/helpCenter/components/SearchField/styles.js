import styled from 'styled-components'
import { Dots } from '@zendeskgarden/react-loaders'

const LoadingDots = styled(Dots)`
  color: ${props => props.theme.baseColor} !important;
  font-size: 24 !important;
`

export { LoadingDots }
