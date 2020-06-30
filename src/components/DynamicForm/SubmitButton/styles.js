import styled from 'styled-components'
import { Dots } from '@zendeskgarden/react-loaders'

const LoadingContainer = styled.div`
  position: relative;
`

const Hidden = styled.div`
  opacity: 0;
`

const LoadingDots = styled(Dots)`
  position: absolute;
  top: 9;
  left: 0;
  right: 0;
  margin: auto;
`

export { LoadingDots, Hidden, LoadingContainer }
