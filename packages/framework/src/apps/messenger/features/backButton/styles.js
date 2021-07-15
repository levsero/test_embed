import styled from 'styled-components'
import { IconButton } from '@zendeskgarden/react-buttons'
import { rem } from 'polished'

const StyledButton = styled(IconButton)`
  &&& {
    height: ${(props) => rem(24, props.theme.baseFontSize)};
    width: ${(props) => rem(24, props.theme.baseFontSize)};
  }
`

export { StyledButton as BackButton }
