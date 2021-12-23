import styled from 'styled-components'
import { Button } from '@zendeskgarden/react-buttons'
import { Dots } from '@zendeskgarden/react-loaders'

const Label = styled.div`
  opacity: ${(props) => (props.showLabel ? 1 : 0)};
`

const Loader = styled.div`
  position: absolute;
`

const LoadingDots = styled(Dots)``

const StyledButton = styled(Button)`
  width: ${(props) => 160 / props.theme.fontSize}rem;
`

export { LoadingDots, Label, Loader, StyledButton as Button }
