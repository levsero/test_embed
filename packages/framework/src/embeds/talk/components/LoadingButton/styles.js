import styled from 'styled-components'
import { Dots } from '@zendeskgarden/react-loaders'
import { Button } from '@zendeskgarden/react-buttons'

const Label = styled.div`
  opacity: ${props => (props.showLabel ? 1 : 0)};
`

const Loader = styled.div`
  position: relative;
  left: -32px;
`

const LoadingDots = styled(Dots)``

const StyledButton = styled(Button)`
  width: ${props => 160 / props.theme.fontSize}rem;
`

export { LoadingDots, Label, Loader, StyledButton as Button }
