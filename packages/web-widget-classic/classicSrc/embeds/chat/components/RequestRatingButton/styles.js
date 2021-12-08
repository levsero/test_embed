import styled from 'styled-components'
import { Button } from '@zendeskgarden/react-buttons'

const StyledButton = styled(Button)`
  margin-top: ${(props) => 10 / props.theme.fontSize}rem !important;
`

export { StyledButton as Button }
